using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Data;
using TripPlanner.API.DTOs.Destinations;
using TripPlanner.API.Models;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DestinationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DestinationsController(
            ApplicationDbContext context)
        {
            _context = context;
        }


        // Anyone can see destinations
        // GET: api/destinations
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetDestinations()
        {
            var destinations = await _context.Destinations
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(destinations);
        }


        // Admin only
        // POST: api/destinations
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateDestination(
            CreateDestinationRequest request)
        {
            var destination = new Destination
            {
                Name = request.Name,
                Country = request.Country,
                Continent = request.Continent,
                DestinationTime = request.DestinationTime,
                EstimatedCost = request.EstimatedCost
            };

            _context.Destinations.Add(destination);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetDestinations),
                new { id = destination.Id },
                destination
            );
        }
    }
}