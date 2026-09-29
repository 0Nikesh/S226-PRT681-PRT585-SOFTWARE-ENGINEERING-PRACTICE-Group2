using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.DTOs.Trips
{
    public class CreateTripRequest
    {
        [Required, StringLength(150)] public string Title { get; set; } = string.Empty;
        [Required, StringLength(100)] public string Country { get; set; } = string.Empty;
        [Required, StringLength(100)] public string City { get; set; } = string.Empty;
        [Range(0, double.MaxValue)] public decimal PriceFrom { get; set; }
        [Range(0, double.MaxValue)] public decimal PriceTo { get; set; }
        [Required, StringLength(3, MinimumLength = 3)] public string Currency { get; set; } = "AUD";
        [Required, StringLength(4000)] public string Description { get; set; } = string.Empty;
        [MinLength(1)] public List<string> ImageUrls { get; set; } = [];
    }
}
