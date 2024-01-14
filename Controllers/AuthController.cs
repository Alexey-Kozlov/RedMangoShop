using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RedMangoShop.Data;
using RedMangoShop.Models;
using RedMangoShop.Models.DTO;
using RedMangoShop.Utility;

namespace RedMangoShop.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{

    private readonly ApplicationDbContext _db;
    private readonly IMapper _mapper;
    private readonly string _secretKey;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    public AuthController(ApplicationDbContext db, IMapper mapper, IConfiguration configuration,
    UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _db = db;
        _mapper = mapper;
        _secretKey = configuration.GetValue<string>("ApiSettings:Secret");
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
    {
        var response = new ApiResponse<object>();
        try
        {
            var user = await _db.ApplicationUser.FirstOrDefaultAsync(p => p.UserName.ToLower() == registerRequestDTO.Login.ToLower());
            if (user != null)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.IsSuccess = false;
                response.ErrorMessages.Add("Такой пользователь уже есть в БД");
                return BadRequest(response);
            }

            var newUser = _mapper.Map<ApplicationUser>(registerRequestDTO);
            var result = await _userManager.CreateAsync(newUser, registerRequestDTO.Password);
            if (result.Succeeded)
            {
                if (!_roleManager.RoleExistsAsync(Constant.Role_Admin).GetAwaiter().GetResult())
                {
                    await _roleManager.CreateAsync(new IdentityRole(Constant.Role_Admin));
                    await _roleManager.CreateAsync(new IdentityRole(Constant.Role_Customer));
                }
                if (registerRequestDTO.Role.ToLower() == Constant.Role_Admin)
                {
                    await _userManager.AddToRoleAsync(newUser, Constant.Role_Admin);
                }
                else
                {
                    await _userManager.AddToRoleAsync(newUser, Constant.Role_Customer);
                }
                response.StatusCode = HttpStatusCode.OK;
                response.IsSuccess = true;
                return Ok(response);
            }
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            response.ErrorMessages.Add("Ошибка регистрации нового пользователя");
            return BadRequest(response);
        }
        catch (Exception ex)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            response.ErrorMessages.Add("Ошибка регистрации нового пользователя - " + ex.Message);
            return BadRequest(response);
        }

    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
    {
        var response = new ApiResponse<LoginResponseDTO>();
        var user = await _db.ApplicationUser.FirstOrDefaultAsync(p => p.UserName.ToLower() == loginRequestDTO.Login.ToLower());
        if (user == null)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            response.ErrorMessages.Add("Ошибка пользователя или пароля");
            return BadRequest(response);
        }
        var isValidUser = await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password);
        if (!isValidUser)
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            response.ErrorMessages.Add("Ошибка пользователя или пароля");
            return BadRequest(response);
        }

        var roles = await _userManager.GetRolesAsync(user);
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim("name", user.Name),
                new Claim("id", user.Id),
                new Claim("login", user.UserName!),
                new Claim(ClaimTypes.Role, string.Join(",", roles))
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        var loginResponse = new LoginResponseDTO()
        {
            Email = user.Email,
            Token = tokenHandler.WriteToken(token),
            Login = user.UserName
        };
        if (string.IsNullOrEmpty(loginResponse.Token))
        {
            response.StatusCode = HttpStatusCode.BadRequest;
            response.IsSuccess = false;
            response.ErrorMessages.Add("Ошибка пользователя или пароля");
            return BadRequest(response);
        }
        response.StatusCode = HttpStatusCode.OK;
        response.IsSuccess = true;
        response.Result = loginResponse;
        return Ok(response);
    }

    [HttpGet("TestAuth")]
    [Authorize(Roles = "admin")]
    public async Task<string> TestAuth()
    {
        return await Task.FromResult("Ok");
    }

    [HttpGet("TestAuthAll")]
    [Authorize(Roles = "admin, customer")]
    public async Task<string> TestAuthAll()
    {
        return await Task.FromResult("Ok");
    }

}
