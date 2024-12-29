using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AuthWebApiPrueba.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; }
        public string PasswordHash { get; set; } = null!;
        public int RoleId { get; set; }
        [JsonIgnore] // Ignorar al recibir el cuerpo de la solicitud
        public Role Role { get; set; } = null!;

    }
}