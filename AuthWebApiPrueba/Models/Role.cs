using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AuthWebApiPrueba.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        [JsonIgnore] // Ignorar al recibir el cuerpo de la solicitud
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}