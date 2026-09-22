namespace TripPlanner.API.DTOs.Destinations
{
    public class DestinationResponse
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Continent { get; set; } = string.Empty;

        public int DestinationTime { get; set; }

        public decimal MinPrice { get; set; }

        public decimal MaxPrice { get; set; }

        public decimal AveragePricePerDay { get; set; }

        public int AverageVisitorsPerWeek { get; set; }

        public string BestSeason { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
