using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthWebApiPrueba.DTOs.Users
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; }
       // public string PasswordHash { get; set; } = null!;
        public string Role { get; set; }
    }
}