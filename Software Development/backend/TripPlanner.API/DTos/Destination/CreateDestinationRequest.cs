using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.DTOs.Destinations
{
    public class CreateDestinationRequest
    {
        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Continent { get; set; } = string.Empty;

        [Range(1, 365)]
        public int DestinationTime { get; set; } = 1;

        [Range(0, double.MaxValue)]
        public decimal MinPrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal MaxPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int AverageVisitorsPerWeek { get; set; }

        [Required]
        [StringLength(40)]
        public string BestSeason { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(200)]
        public string MapsQuery { get; set; } = string.Empty;

        public List<HotelRequest> Hotels { get; set; } = [];
    }

    public class HotelRequest
    {
        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string Area { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal PricePerNight { get; set; }

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(200)]
        public string MapsQuery { get; set; } = string.Empty;
    }
}
