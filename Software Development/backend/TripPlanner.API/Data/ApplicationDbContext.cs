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
        public DbSet<DestinationHotel> DestinationHotels { get; set; }
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
                entity.Property(destination => destination.MapsQuery).HasMaxLength(200);
            });

            builder.Entity<DestinationHotel>(entity =>
            {
                entity.Property(hotel => hotel.Name).HasMaxLength(150);
                entity.Property(hotel => hotel.Area).HasMaxLength(100);
                entity.Property(hotel => hotel.Description).HasMaxLength(1000);
                entity.Property(hotel => hotel.MapsQuery).HasMaxLength(200);
                entity.Property(hotel => hotel.PricePerNight).HasPrecision(18, 2);
                entity.HasOne(hotel => hotel.Destination)
                    .WithMany(destination => destination.Hotels)
                    .HasForeignKey(hotel => hotel.DestinationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
