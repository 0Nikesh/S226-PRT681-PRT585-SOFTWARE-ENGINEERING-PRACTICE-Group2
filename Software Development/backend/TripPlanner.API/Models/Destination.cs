namespace TripPlanner.API.Models
{
    public class Destination
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Continent { get; set; } = string.Empty;

        // Recommended trip length in days
        public int DestinationTime { get; set; }

        // Kept for existing rows. New posts store the calculated daily average here.
        public decimal EstimatedCost { get; set; }

        // Daily price range in AUD. Average price per day is (MinPrice + MaxPrice) / 2.
        public decimal MinPrice { get; set; }

        public decimal MaxPrice { get; set; }

        public int AverageVisitorsPerWeek { get; set; }

        public string BestSeason { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}