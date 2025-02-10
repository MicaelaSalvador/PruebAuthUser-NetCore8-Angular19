import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import RolService, { RoleDto } from '../../shared/services/rol.service';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule, FirstKeyPipe, RouterLink],
  templateUrl: './registration.component.html',
  styles: ``,
})
export class RegistrationComponent implements OnInit {
  constructor(public service: AuthService, private rolService: RolService) {}

  public roles: RoleDto[] = []; // Propiedad para almacenar los roles
  public formBuilder = inject(FormBuilder);
  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true });
    else confirmPassword?.setErrors(null);

    return null;
  };

  form = this.formBuilder.group(
    {
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleName: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/),
        ],
      ],
      confirmPassword: [''],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolService.getRoles(1, 100).subscribe({
      next: (response) => {
        this.roles = response.roles; // Asigna los roles obtenidos desde el backend
        console.log('roles', this.roles);
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los roles. Intente más tarde.',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value).subscribe({
        next: (res: any) => {
          if (res.message) {
            this.form.reset();
            this.isSubmitted = false;

            Swal.fire({
              title: 'Success!',
              text: res.message,
              icon: 'success',
            });
          }
        },
        error: (error) => {
          const errorMessage = error.error?.message;

          Swal.fire({
            icon: 'error',
            title: 'Error de registro',
            text: errorMessage,
            confirmButtonText: 'Aceptar',
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
    );
  }
}
