using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Data;
using TripPlanner.API.DTOs.Trips;
using TripPlanner.API.Models;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/trips")]
    public class TripsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TripsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trips = await _context.Trips.AsNoTracking()
                .Include(trip => trip.Images).Include(trip => trip.Ratings)
                .OrderByDescending(trip => trip.CreatedAt).ToListAsync();
            return Ok(trips.Select(ToResponse));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var trip = await FindTrip(id, false);
            return trip is null ? NotFound(new { message = "Trip not found." }) : Ok(ToResponse(trip));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateTripRequest request)
        {
            if (request.PriceTo < request.PriceFrom)
                return BadRequest(new { message = "PriceTo must be greater than or equal to PriceFrom." });

            var trip = new Trip
            {
                Title = request.Title.Trim(), Country = request.Country.Trim(), City = request.City.Trim(),
                PriceFrom = request.PriceFrom, PriceTo = request.PriceTo,
                Currency = request.Currency.Trim().ToUpperInvariant(), Description = request.Description.Trim(),
                CreatedByUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!,
                Images = request.ImageUrls.Where(url => !string.IsNullOrWhiteSpace(url))
                    .Select(url => new TripImage { ImageUrl = url.Trim() }).ToList()
            };
            if (trip.Images.Count == 0) return BadRequest(new { message = "At least one image URL is required." });
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = trip.Id }, ToResponse(trip));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateTripRequest request)
        {
            if (request.PriceTo < request.PriceFrom) return BadRequest(new { message = "PriceTo must be greater than or equal to PriceFrom." });
            var trip = await FindTrip(id, true);
            if (trip is null) return NotFound(new { message = "Trip not found." });
            var urls = request.ImageUrls.Where(url => !string.IsNullOrWhiteSpace(url)).Select(url => url.Trim()).ToList();
            if (urls.Count == 0) return BadRequest(new { message = "At least one image URL is required." });
            trip.Title = request.Title.Trim(); trip.Country = request.Country.Trim(); trip.City = request.City.Trim();
            trip.PriceFrom = request.PriceFrom; trip.PriceTo = request.PriceTo; trip.Currency = request.Currency.Trim().ToUpperInvariant(); trip.Description = request.Description.Trim();
            _context.TripImages.RemoveRange(trip.Images); trip.Images = urls.Select(url => new TripImage { ImageUrl = url }).ToList();
            await _context.SaveChangesAsync();
            return Ok(ToResponse(trip));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip is null) return NotFound(new { message = "Trip not found." });
            _context.Trips.Remove(trip); await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpPost("{id:int}/ratings")]
        public async Task<IActionResult> Rate(int id, RateTripRequest request)
        {
            if (!await _context.Trips.AnyAsync(trip => trip.Id == id)) return NotFound(new { message = "Trip not found." });
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var rating = await _context.TripRatings.SingleOrDefaultAsync(rating => rating.TripId == id && rating.UserId == userId);
            if (rating is null) _context.TripRatings.Add(new TripRating { TripId = id, UserId = userId, Score = request.Score });
            else { rating.Score = request.Score; rating.UpdatedAt = DateTime.UtcNow; }
            await _context.SaveChangesAsync();
            var trip = await FindTrip(id, false);
            return Ok(new { message = "Rating saved.", trip = ToResponse(trip!) });
        }

        private Task<Trip?> FindTrip(int id, bool tracked) =>
            (tracked ? _context.Trips : _context.Trips.AsNoTracking()).Include(trip => trip.Images).Include(trip => trip.Ratings).SingleOrDefaultAsync(trip => trip.Id == id);

        private static object ToResponse(Trip trip) => new
        {
            trip.Id, trip.Title, trip.Country, trip.City, trip.PriceFrom, trip.PriceTo, trip.Currency, trip.Description,
            imageUrls = trip.Images.Select(image => image.ImageUrl),
            averageRating = trip.Ratings.Count == 0 ? 0 : Math.Round(trip.Ratings.Average(rating => rating.Score), 1),
            ratingCount = trip.Ratings.Count, trip.CreatedAt
        };
    }
}
