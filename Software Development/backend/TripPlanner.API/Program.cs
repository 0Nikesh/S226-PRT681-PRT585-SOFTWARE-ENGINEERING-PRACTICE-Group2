using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TripPlanner.API.Data;
using TripPlanner.API.Models;
using TripPlanner.API.Services;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Logging.ClearProviders();
    builder.Logging.AddConsole();
}

// Store development keys with the project instead of using Windows keys owned by another account.
if (builder.Environment.IsDevelopment())
{
    var keysDirectory = Path.Combine(builder.Environment.ContentRootPath, "App_Data", "DataProtection-Keys");
    builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(keysDirectory));
}

// ============================================
// LOAD .env FILE
// ============================================

DotNetEnv.Env.Load();

// ============================================
// DATABASE
// ============================================
// 1. Retrieve the connection string

var connectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection"
    ) ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// 2. Replace ${DB_PASS} placeholder with the environment variable
var dbPass = Environment.GetEnvironmentVariable("DB_PASS")
    ?? throw new InvalidOperationException("DB_PASS environment variable not found. Check your .env file.");
connectionString = connectionString.Replace("${DB_PASS}", dbPass);

// 2. Detect the MySQL server version automatically
var serverVersion = ServerVersion.AutoDetect(connectionString);

// 3. Register the DbContext service
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    );
});




// ============================================
// ASP.NET IDENTITY
// ============================================

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;

        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();


// ============================================
// JWT AUTHENTICATION
// ============================================

var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey!)
                    )
            };
    });


// ============================================
// JWT SERVICE
// ============================================

builder.Services.AddScoped<JwtService>();


// ============================================
// CONTROLLERS
// ============================================

builder.Services.AddControllers();


// ============================================
// CORS
// ============================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// ============================================
// SWAGGER
// ============================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ============================================
// BUILD APPLICATION
// ============================================

var app = builder.Build();


// ============================================
// SWAGGER
// ============================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ============================================
// MIDDLEWARE
// ============================================

app.UseHttpsRedirection();

Directory.CreateDirectory(app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot"));
app.UseStaticFiles();

app.UseCors("Frontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


// ============================================
// SEED ADMIN
// ============================================

using (var scope = app.Services.CreateScope())
{
    await SeedAdminAsync(scope.ServiceProvider);
}


app.Run();


// ============================================
// ADMIN SEED METHOD
// ============================================

static async Task SeedAdminAsync(
    IServiceProvider services)
{
    var roleManager =
        services.GetRequiredService<RoleManager<IdentityRole>>();

    var userManager =
        services.GetRequiredService<UserManager<ApplicationUser>>();


    // ----------------------------------------
    // Create Admin Role
    // ----------------------------------------

    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(
            new IdentityRole("Admin")
        );
    }


    // ----------------------------------------
    // Create User Role
    // ----------------------------------------

    if (!await roleManager.RoleExistsAsync("User"))
    {
        await roleManager.CreateAsync(
            new IdentityRole("User")
        );
    }


    // ----------------------------------------
    // Create Admin Account
    // ----------------------------------------

    var adminEmail = "admin@tripplanner.com";
    var adminPassword = "Admin@123456";


    var admin =
        await userManager.FindByEmailAsync(adminEmail);


    if (admin == null)
    {
        admin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true,
            Name = "TripPlanner Admin",
            Country = "Australia"
        };


        var result =
            await userManager.CreateAsync(
                admin,
                adminPassword
            );


        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(
                admin,
                "Admin"
            );
        }
    }
}
