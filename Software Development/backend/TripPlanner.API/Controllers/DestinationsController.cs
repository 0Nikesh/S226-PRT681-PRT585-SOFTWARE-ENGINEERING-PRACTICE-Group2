using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Data;
using TripPlanner.API.DTOs.Destinations;
using TripPlanner.API.Models;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/destinations")]
    public class DestinationsController : ControllerBase
    {
        private static readonly string[] Seasons = ["Spring", "Summer", "Autumn", "Winter"];

        private readonly ApplicationDbContext _context;

        public DestinationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var destinations = await _context.Destinations
                .AsNoTracking()
                .OrderByDescending(destination => destination.AverageVisitorsPerWeek)
                .ThenBy(destination => destination.Name)
                .ToListAsync();

            return Ok(destinations.Select(ToResponse));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var destination = await _context.Destinations
                .AsNoTracking()
                .SingleOrDefaultAsync(destination => destination.Id == id);

            if (destination is null)
            {
                return NotFound(new { message = "Destination not found." });
            }

            return Ok(ToResponse(destination));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateDestinationRequest request)
        {
            if (request.MaxPrice < request.MinPrice)
            {
                return BadRequest(new
                {
                    message = "Maximum price must be greater than or equal to minimum price."
                });
            }

            if (!TryNormalizeSeason(request.BestSeason, out var season))
            {
                return BadRequest(new
                {
                    message = "Best season must be Spring, Summer, Autumn, or Winter."
                });
            }

            var averagePricePerDay = AveragePricePerDay(request.MinPrice, request.MaxPrice);

            var destination = new Destination
            {
                Name = request.Name.Trim(),
                Country = request.Country.Trim(),
                Continent = request.Continent.Trim(),
                DestinationTime = request.DestinationTime,
                MinPrice = request.MinPrice,
                MaxPrice = request.MaxPrice,
                EstimatedCost = averagePricePerDay,
                AverageVisitorsPerWeek = request.AverageVisitorsPerWeek,
                BestSeason = season,
                Description = request.Description.Trim(),
                ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl)
                    ? null
                    : request.ImageUrl.Trim()
            };

            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = destination.Id },
                ToResponse(destination));
        }

        public static decimal AveragePricePerDay(decimal minPrice, decimal maxPrice)
        {
            return Math.Round((minPrice + maxPrice) / 2m, 2, MidpointRounding.AwayFromZero);
        }

        private static bool TryNormalizeSeason(string value, out string season)
        {
            season = Seasons.FirstOrDefault(item =>
                item.Equals(value.Trim(), StringComparison.OrdinalIgnoreCase)) ?? string.Empty;

            return season.Length > 0;
        }

        private static DestinationResponse ToResponse(Destination destination)
        {
            return new DestinationResponse
            {
                Id = destination.Id,
                Name = destination.Name,
                Country = destination.Country,
                Continent = destination.Continent,
                DestinationTime = destination.DestinationTime,
                MinPrice = destination.MinPrice,
                MaxPrice = destination.MaxPrice,
                AveragePricePerDay = AveragePricePerDay(destination.MinPrice, destination.MaxPrice),
                AverageVisitorsPerWeek = destination.AverageVisitorsPerWeek,
                BestSeason = destination.BestSeason,
                Description = destination.Description,
                ImageUrl = destination.ImageUrl,
                CreatedAt = destination.CreatedAt
            };
        }
    }
}
