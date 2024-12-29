using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AuthWebApiPrueba.DTOs.Roles;
using AuthWebApiPrueba.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthWebApiPrueba.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public RolesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
       //[Authorize(Roles = "Admin,User")]
       [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetRoles(int pageNumber = 1, int pageSize = 10)
        {
            // Contar el total de roles en la base de datos
            var totalRecords = await _context.Roles.CountAsync();

            // Obtener los roles paginados
            var roles = await _context.Roles
                                      .Skip((pageNumber - 1) * pageSize)
                                      .Take(pageSize)
                                      .Select(r => new
                                      {
                                          Id = r.Id,
                                          Name = r.Name
                                      })
                                      .ToListAsync();

            // Crear una respuesta con el total de registros y los datos paginados
            var result = new
            {
                TotalRecords = totalRecords,
                Roles = roles
            };
            return Ok(result);
        }


        // Obtener un rol por ID (Autorizado para Admin y User)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound("Rol no encontrado.");
            }

            return Ok(role);
        }


        // Crear un nuevo rol (Solo Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRole([FromBody] RoleDto dto)
        {
            if (await _context.Roles.AnyAsync(r => r.Name == dto.Name))
            {
                // return BadRequest( new { message="El rol ya existe."} );
                return BadRequest(new { message = $"El rol '{dto.Name}' ya existe." });
            }

            var role = new Role
            {
                Name = dto.Name
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return Ok(role);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] RoleDto roleUpdateDto)
        {
            if (roleUpdateDto == null || string.IsNullOrEmpty(roleUpdateDto.Name))
            {
                return BadRequest(new { message = "Invalid role data" });
            }

            // Busca el rol por ID
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(new { message = "Role no encontrado" });
            }

            // Verifica si ya existe un rol con el mismo nombre (excluyendo el actual)
            var existingRole = await _context.Roles
                .Where(r => r.Name == roleUpdateDto.Name && r.Id != id)
                .FirstOrDefaultAsync();

            if (existingRole != null)
            {
                return Conflict(new { message = "Ya existe un rol con este nombre." });
            }

            // Actualiza el nombre del rol
            role.Name = roleUpdateDto.Name;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Role actualizado  correctamente" });
            }
            catch (Exception ex)
            {
                // Manejo de errores en caso de conflictos o problemas en la base de datos
                return StatusCode(500, new { message = "Ocurrió  un error  mientras  actualizaba  el rol", error = ex.Message });
            }
        }


        // Eliminar un rol (Solo Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound("Rol no encontrado.");
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            // return Ok("Rol eliminado con éxito.");
            return Ok(new { message = "Rol eliminado con éxito." });
        }

    }
}