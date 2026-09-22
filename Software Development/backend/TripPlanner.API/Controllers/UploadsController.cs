using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TripPlanner.API.Controllers;

[ApiController]
[Route("api/uploads")]
[Authorize(Roles = "Admin")]
public class UploadsController : ControllerBase
{
    private const long MaxImageSize = 5 * 1024 * 1024;

    private static readonly Dictionary<string, string> AllowedImageTypes = new()
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp",
        ["image/gif"] = ".gif"
    };

    private readonly IWebHostEnvironment _environment;

    public UploadsController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("trip-image")]
    [RequestSizeLimit(MaxImageSize)]
    public async Task<IActionResult> UploadTripImage(IFormFile image)
    {
        if (image is null || image.Length == 0)
            return BadRequest(new { message = "An image file is required." });

        if (image.Length > MaxImageSize)
            return BadRequest(new { message = "The image must be 5 MB or smaller." });

        if (!AllowedImageTypes.TryGetValue(image.ContentType.ToLowerInvariant(), out var extension))
            return BadRequest(new { message = "Only JPEG, PNG, WEBP, and GIF images are allowed." });

        var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        var uploadsDirectory = Path.Combine(webRoot, "uploads", "trips");
        Directory.CreateDirectory(uploadsDirectory);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsDirectory, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await image.CopyToAsync(stream);
        }

        var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/trips/{fileName}";
        return Created(fileUrl, new { imageUrl = fileUrl });
    }
}
