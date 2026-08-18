using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.DTOs.Destinations
{
    public class CreateDestinationRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required]
        public string Continent { get; set; } = string.Empty;

        [Range(1, 365)]
        public int DestinationTime { get; set; }

        [Range(0, double.MaxValue)]
        public decimal EstimatedCost { get; set; }
    }
}