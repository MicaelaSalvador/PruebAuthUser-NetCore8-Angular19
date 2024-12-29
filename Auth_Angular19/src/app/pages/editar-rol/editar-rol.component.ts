import { Component, OnInit } from '@angular/core';
import RolService, { RoleDto } from '../../shared/services/rol.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-editar-rol',
  imports: [CommonModule,MatCardModule,MatFormFieldModule,MatInputModule,FormsModule,RouterLink,MatButtonModule ],
  templateUrl: './editar-rol.component.html',
  styleUrl: './editar-rol.component.css'
})
export class EditarRolComponent implements OnInit {

  roleId!: number;
  role: RoleDto = { name: '' };  // Inicializa el rol con un nombre vacío

  constructor(
    private route: ActivatedRoute,
    private service: RolService,
    private router: Router,
  ) { }

  
  ngOnInit(): void {
     // Obtener el ID del rol desde la URL
     this.roleId = Number(this.route.snapshot.paramMap.get('id'));
     this.loadRole();  // Cargar el rol actual desde el backend
  }

   // Método para cargar el rol desde el backend
   loadRole(): void {
    this.service.getRoleById(this.roleId).subscribe(
      (data) => {
        this.role = data;  // Asigna el rol a la propiedad `role`
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el rol',
        });
      }
    );
  }

    // Método para actualizar el rol
    updateRole(): void {
      this.service.updateRole(this.roleId, this.role).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.message,
          }).then(() => {
            this.router.navigate(['/nav/detalle-rol']);  // Redirige a la lista de roles después de la actualización
          });
        },
        (error) => {
           // Manejo de errores con mensajes del backend
           const errorMessage = error.error.message || 'Ocurrió un error al cargar el rol.';
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: errorMessage
           });
        }
      );
    }

}
