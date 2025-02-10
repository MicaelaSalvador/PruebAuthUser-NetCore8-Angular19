import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  constructor(private service: AuthService, private router: Router) {}

  public formBuilder = inject(FormBuilder);
  isSubmitted: boolean = false;

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.service.signin(email!, password!).subscribe({
        next: (response) => {
          if (response.result) {
            // Mostrar notificación de éxito con SweetAlert
            Swal.fire({
              icon: 'success',
              title: 'Login exitoso',
              text: '¡Bienvenido!',
              timer: 1500,
              showConfirmButton: false,
            });

            // Guardar el token en localStorage
            localStorage.setItem('token', response.data.token);

            // Redirigir al usuario a otra página
            this.router.navigateByUrl('/nav/detalle-user');
          } else {
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Error en el login',
              text: response.message,
            });
          }
        },
        error: (err) => {
          // Mostrar error con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error en el login',
            text: err.error.message || 'Ha ocurrido un error inesperado.',
          });
        },
      });
    }
  }
}
