namespace TripPlanner.API.Models
{
    public class Destination
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Continent { get; set; } = string.Empty;

        // Number of days
        public int DestinationTime { get; set; }

        // Estimated cost in AUD
        public decimal EstimatedCost { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}