using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TripPlanner.API.DTOs.Auth;
using TripPlanner.API.Models;
using TripPlanner.API.Services;

namespace TripPlanner.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            JwtService jwtService,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            RegisterRequest request)
        {
            var existingUser = await _userManager
                .FindByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Email is already registered."
                });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                Country = request.Country
            };

            var result = await _userManager
                .CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            await _userManager.AddToRoleAsync(user, "User");

            var token = await _jwtService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email!,
                Role = "User"
            });
        }


        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            LoginRequest request)
        {
            var user = await _userManager
                .FindByEmailAsync(request.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            var result = await _signInManager
                .CheckPasswordSignInAsync(
                    user,
                    request.Password,
                    false
                );

            if (!result.Succeeded)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            var roles = await _userManager
                .GetRolesAsync(user);

            var token = await _jwtService
                .GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email!,
                Role = roles.FirstOrDefault() ?? "User"
            });
        }


        // POST: api/auth/google
        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin(
            GoogleLoginRequest request)
        {
            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload = await GoogleJsonWebSignature
                    .ValidateAsync(
                        request.IdToken,
                        new GoogleJsonWebSignature.ValidationSettings
                        {
                            Audience = new[]
                            {
                                _configuration["Google:ClientId"]
                            }
                        }
                    );
            }
            catch
            {
                return Unauthorized(new
                {
                    message = "Invalid Google token."
                });
            }

            var user = await _userManager
                .FindByEmailAsync(payload.Email);

            // Create new user
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    Name = payload.Name ?? "",
                    Country = request.Country ?? "",
                    PhoneNumber = request.PhoneNumber
                };

                var createResult = await _userManager
                    .CreateAsync(user);

                if (!createResult.Succeeded)
                {
                    return BadRequest(new
                    {
                        errors = createResult.Errors
                            .Select(e => e.Description)
                    });
                }

                await _userManager
                    .AddToRoleAsync(user, "User");
            }

            var token = await _jwtService
                .GenerateToken(user);

            var roles = await _userManager
                .GetRolesAsync(user);

            return Ok(new AuthResponse
            {
                Token = token,
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email!,
                Role = roles.FirstOrDefault() ?? "User"
            });
        }
    }
}