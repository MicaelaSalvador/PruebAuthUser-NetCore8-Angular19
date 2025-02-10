using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AuthWebApiPrueba.DTOs
{
    public class RegisterDto
    {
        // //public int Id { get; set; }
        // public string UserName { get; set; } = null!;
        // public string Email { get; set; } = null!;
        // public string Password { get; set; } = null!;
        // // public int RoleId { get; set; }
        // public string RoleName { get; set; } = null!; // Cambiar a RoleName

        [Required(ErrorMessage = "El nombre de usuario es requerido.")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "El correo electrónico es requerido.")]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "La contraseña es requerida.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "El nombre del rol es requerido.")]
        public string RoleName { get; set; } = null!;

    }
}