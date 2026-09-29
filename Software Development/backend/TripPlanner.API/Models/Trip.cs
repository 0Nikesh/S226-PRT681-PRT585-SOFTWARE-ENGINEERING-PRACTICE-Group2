namespace TripPlanner.API.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public decimal PriceFrom { get; set; }
        public decimal PriceTo { get; set; }
        public string Currency { get; set; } = "AUD";
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedByUserId { get; set; } = string.Empty;
        public List<TripImage> Images { get; set; } = [];
        public List<TripRating> Ratings { get; set; } = [];
    }

    public class TripImage
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public Trip Trip { get; set; } = null!;
    }

    public class TripRating
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int Score { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public Trip Trip { get; set; } = null!;
    }
}
