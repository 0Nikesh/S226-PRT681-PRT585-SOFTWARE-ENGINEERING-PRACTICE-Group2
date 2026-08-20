using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TripPlanner.API.Data;
using TripPlanner.API.Models;
using TripPlanner.API.Services;

var builder = WebApplication.CreateBuilder(args);


// ============================================
// DATABASE
// ============================================

var connectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection"
    );

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