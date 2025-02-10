import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import RolService from '../../shared/services/rol.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-insertar-rol',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './insertar-rol.component.html',
  styleUrl: './insertar-rol.component.css',
})
export class InsertarRolComponent {
  roleForm!: FormGroup;
  private fb = inject(FormBuilder);

  constructor(private service: RolService, private router: Router) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      this.service.createRole(this.roleForm.value).subscribe({
        next: (response) => {
          console.log('Rol creado exitosamente', response);
          Swal.fire('success', 'Rol creado correctamente', 'success');
          this.router.navigate(['/nav/detalle-rol']); // Redireccionar a la lista de roles
        },
        error: (error) => {
          console.error('Error al crear el rol', error);
          // Capturar el mensaje desde el backend
          const errorMessage =
            error.error?.message || 'Ocurrió un error inesperado.';
          Swal.fire('Error', errorMessage, 'error');

          // Limpiar el input del formulario
          this.roleForm.patchValue({ name: '' });

          // Redireccionar a la lista de roles incluso en caso de error
          this.router.navigate(['/nav/detalle-rol']);
        },
      });
    } else {
      Swal.fire('Atención', 'Por favor, complete el formulario.', 'warning');
    }
  }
}
