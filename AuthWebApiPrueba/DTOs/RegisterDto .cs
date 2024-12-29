using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthWebApiPrueba.DTOs
{
    public class RegisterDto
    {
        //public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; }= null!;
        public string Password { get; set; }= null!;
        // public int RoleId { get; set; }
          public string RoleName { get; set; } = null!; // Cambiar a RoleName
    }
}