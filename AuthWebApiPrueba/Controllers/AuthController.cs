using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AuthWebApiPrueba.DTOs;
using AuthWebApiPrueba.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AuthWebApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            this._configuration = configuration;
            _context = context;

        }


        // [HttpPost("register")]
        // [AllowAnonymous]
        // public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        // {
        //     // Verificar si ya existe un usuario con el mismo correo electrónico
        //     if (await _context.Users.AnyAsync(u => u.Email.ToLower() == registerDto.Email.ToLower()))
        //     {
        //         return BadRequest(new { messageExistingEmail = "El correo electrónico ya está registrado." });
        //     }

        //     // Verificar que el rol proporcionado exista por nombre
        //     var rol = await _context.Roles
        //                              .FirstOrDefaultAsync(r => r.Name.ToLower() == registerDto.RoleName.ToLower()); // Buscar por nombre
        //     if (rol == null)
        //     {
        //         return BadRequest(new { messageNoRole = "El rol proporcionado no existe." });
        //     }

        //     // Validar si ya existe un usuario con el mismo nombre
        //     bool existeUsuario = await _context.Users.AnyAsync(r => r.UserName.ToLower() == registerDto.UserName.ToLower());
        //     if (existeUsuario)
        //     {
        //         return BadRequest(new { messageExistingUsuario = "Ya existe un usuario con ese nombre." });
        //     }

        //     // Crear y guardar el usuario en la base de datos
        //     var usuario = new User
        //     {
        //         UserName = registerDto.UserName,
        //         Email = registerDto.Email,
        //         PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
        //         RoleId = rol.Id // Asignar el RoleId del rol encontrado
        //     };

        //     _context.Users.Add(usuario);
        //     await _context.SaveChangesAsync();

        //     // Respuesta exitosa
        //     return Ok(new
        //     {
        //         message = "Usuario registrado con éxito.",
        //         user = new
        //         {
        //             UserName = registerDto.UserName,
        //             Email = registerDto.Email,
        //             RoleName = registerDto.RoleName // Incluir el nombre del rol en la respuesta
        //         }
        //     });
        // }


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Verificar si ya existe un usuario con el mismo nombre de usuario o correo electrónico
            var existeUsuario = await _context.Users
                .AnyAsync(u => u.UserName.ToLower() == registerDto.UserName.ToLower() ||
                               u.Email.ToLower() == registerDto.Email.ToLower());

            if (existeUsuario)
            {
                return BadRequest(new { message = "El nombre de usuario o correo electrónico ya está registrado." });
            }

            // Verificar que el rol proporcionado exista por nombre
            var rol = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name.ToLower() == registerDto.RoleName.ToLower());

            if (rol == null)
            {
                return BadRequest(new { message = "El rol proporcionado no existe." });
            }

            // Crear y guardar el usuario en la base de datos
            var usuario = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                RoleId = rol.Id // Asignar el RoleId del rol encontrado
            };

            _context.Users.Add(usuario);
            await _context.SaveChangesAsync();

            // Respuesta exitosa
            return Ok(new
            {
                message = "Usuario registrado con éxito.",
                user = new
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                    RoleName = registerDto.RoleName // Incluir el nombre del rol en la respuesta
                }
            });
        }



        // Login de usuario

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            // Busca al usuario por correo electrónico
            var user = await _context.Users.Include(u => u.Role)
                                           .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            // Verifica la contraseña
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            // Genera el token JWT
            var token = GenerateJwtToken(user);
            return Ok(new
            {
                Message = "Login success.",
                result = true,
                data = new { token }
            });
        }
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.Name)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
