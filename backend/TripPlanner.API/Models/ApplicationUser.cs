using Microsoft.AspNetCore.Identity;

namespace TripPlanner.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;
    }
}