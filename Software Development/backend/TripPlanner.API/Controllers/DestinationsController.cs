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
                .Include(destination => destination.Hotels)
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
                .Include(item => item.Hotels)
                .SingleOrDefaultAsync(item => item.Id == id);

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

            var destination = new Destination();
            Apply(destination, request, season, averagePricePerDay);
            destination.Hotels = MapHotels(request.Hotels);

            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = destination.Id },
                ToResponse(destination));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateDestinationRequest request)
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

            var destination = await _context.Destinations
                .Include(item => item.Hotels)
                .SingleOrDefaultAsync(item => item.Id == id);

            if (destination is null)
            {
                return NotFound(new { message = "Destination not found." });
            }

            Apply(destination, request, season, AveragePricePerDay(request.MinPrice, request.MaxPrice));
            _context.DestinationHotels.RemoveRange(destination.Hotels);
            destination.Hotels = MapHotels(request.Hotels);
            await _context.SaveChangesAsync();

            return Ok(ToResponse(destination));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var destination = await _context.Destinations.FindAsync(id);

            if (destination is null)
            {
                return NotFound(new { message = "Destination not found." });
            }

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static void Apply(Destination destination, CreateDestinationRequest request, string season, decimal averagePricePerDay)
        {
            destination.Name = request.Name.Trim();
            destination.Country = request.Country.Trim();
            destination.Continent = request.Continent.Trim();
            destination.DestinationTime = request.DestinationTime;
            destination.MinPrice = request.MinPrice;
            destination.MaxPrice = request.MaxPrice;
            destination.EstimatedCost = averagePricePerDay;
            destination.AverageVisitorsPerWeek = request.AverageVisitorsPerWeek;
            destination.BestSeason = season;
            destination.Description = request.Description.Trim();
            destination.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim();
            destination.MapsQuery = request.MapsQuery.Trim();
        }

        private static List<DestinationHotel> MapHotels(IEnumerable<HotelRequest>? hotels)
        {
            return (hotels ?? [])
                .Where(hotel => !string.IsNullOrWhiteSpace(hotel.Name))
                .Select(hotel => new DestinationHotel
                {
                    Name = hotel.Name.Trim(),
                    Area = hotel.Area.Trim(),
                    PricePerNight = hotel.PricePerNight,
                    Description = hotel.Description.Trim(),
                    MapsQuery = string.IsNullOrWhiteSpace(hotel.MapsQuery) ? hotel.Name.Trim() : hotel.MapsQuery.Trim()
                })
                .ToList();
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
                MapsQuery = destination.MapsQuery,
                Hotels = destination.Hotels.Select(hotel => new HotelResponse
                {
                    Id = hotel.Id,
                    Name = hotel.Name,
                    Area = hotel.Area,
                    PricePerNight = hotel.PricePerNight,
                    Description = hotel.Description,
                    MapsQuery = hotel.MapsQuery
                }).ToList(),
                CreatedAt = destination.CreatedAt
            };
        }
    }
}
