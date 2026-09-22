using System.ComponentModel.DataAnnotations;

namespace TripPlanner.API.DTOs.Trips
{
    public class RateTripRequest
    {
        [Range(1, 5)]
        public int Score { get; set; }
    }
}
