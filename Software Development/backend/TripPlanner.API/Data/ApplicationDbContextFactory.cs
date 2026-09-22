using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TripPlanner.API.Data
{
    // Lets `dotnet ef migrations add` build the model without connecting to MySQL.
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            DotNetEnv.Env.Load();
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var connectionString = configuration.GetConnectionString("DefaultConnection")!
                .Replace("${DB_PASS}", Environment.GetEnvironmentVariable("DB_PASS") ?? "password");
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0)))
                .Options;
            return new ApplicationDbContext(options);
        }
    }
}
