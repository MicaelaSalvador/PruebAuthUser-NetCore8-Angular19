using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthWebApiPrueba.DTOs.Users;
using AuthWebApiPrueba.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthWebApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // READ: Get all users
        [HttpGet]
        [Authorize(Roles = "Admin,User")]

        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers(int pageNumber = 1, int pageSize = 10)
        {
            // Contar el total de usuarios en la base de datos
            var totalRecords = await _context.Users.CountAsync();

            // Obtener los usuarios paginados
            var users = await _context.Users.Include(u => u.Role)
                                            .Skip((pageNumber - 1) * pageSize)
                                            .Take(pageSize)
                                            .Select(u => new UserResponseDto
                                            {
                                                Id = u.Id,
                                                UserName = u.UserName,
                                                Email = u.Email,
                                                Role = u.Role.Name
                                            }).ToListAsync();

            // Crear una respuesta con el total de registros y los datos paginados
            var result = new
            {
                TotalRecords = totalRecords,
                Users = users
            };

            return Ok(result);
        }

        // public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        // {
        //     var users = await _context.Users.Include(u => u.Role)
        //                                     .Select(u => new UserResponseDto
        //                                     {
        //                                         Id = u.Id,
        //                                         UserName = u.UserName,
        //                                         Email = u.Email,
        //                                         Role = u.Role.Name
        //                                     }).ToListAsync();

        //     return Ok(users);
        // }



        // READ: Get user by ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            var user = await _context.Users.Include(u => u.Role)
                                           .Where(u => u.Id == id)
                                           .Select(u => new UserResponseDto
                                           {
                                               Id = u.Id,
                                               UserName = u.UserName,
                                               Email = u.Email,
                                               Role = u.Role.Name
                                           }).FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Usuario  no encontrado" });

            return Ok(user);
        }

        // UPDATE: Update user by ID
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Usuario  no encontrado" });

            // Verificar si existe otro usuario con el mismo nombre de usuario o correo electrónico
            var existingUser = await _context.Users
                .Where(u => (u.UserName == updateUserDto.UserName || u.Email == updateUserDto.Email) && u.Id != id)
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                return Conflict(new { message = "Ya existe un usuario con este nombre de usuario o correo electrónico." });
            }

            // Actualiza los campos básicos
            user.UserName = updateUserDto.UserName;
            user.Email = updateUserDto.Email;
            user.PasswordHash = updateUserDto.Password;
            user.RoleId = updateUserDto.RoleId;

            // Si se proporciona una nueva contraseña, encripta y actualiza
            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);
            }
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Usuario actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocurrio un error  mientras se actualizaba el Usuario", error = ex.Message });
            }
        }

        // DELETE: Delete user by ID
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "Usuario  no encontrado" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario eliminado correctamente" });
        }
    }
}