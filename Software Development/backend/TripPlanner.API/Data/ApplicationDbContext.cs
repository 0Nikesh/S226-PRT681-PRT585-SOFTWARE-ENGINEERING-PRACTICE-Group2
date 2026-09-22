using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Models;

namespace TripPlanner.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripImage> TripImages { get; set; }
        public DbSet<TripRating> TripRatings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<TripImage>()
                .HasOne(image => image.Trip)
                .WithMany(trip => trip.Images)
                .HasForeignKey(image => image.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TripRating>()
                .HasIndex(rating => new { rating.TripId, rating.UserId })
                .IsUnique();

            builder.Entity<TripRating>()
                .HasOne(rating => rating.Trip)
                .WithMany(trip => trip.Ratings)
                .HasForeignKey(rating => rating.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TripRating>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(rating => rating.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Destination>(entity =>
            {
                entity.Property(destination => destination.MinPrice).HasPrecision(18, 2);
                entity.Property(destination => destination.MaxPrice).HasPrecision(18, 2);
                entity.Property(destination => destination.BestSeason).HasMaxLength(40);
                entity.Property(destination => destination.Description).HasMaxLength(1000);
                entity.Property(destination => destination.ImageUrl).HasMaxLength(500);
            });
        }
    }
}
