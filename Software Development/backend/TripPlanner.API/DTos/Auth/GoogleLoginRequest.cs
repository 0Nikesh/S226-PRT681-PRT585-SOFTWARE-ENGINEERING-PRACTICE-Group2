using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.DTOs.Auth
{
    public class GoogleLoginRequest
    {
        [Required]
        public string IdToken { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string? Country { get; set; }
    }
}