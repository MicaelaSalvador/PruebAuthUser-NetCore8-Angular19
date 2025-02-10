import {
  Component,
  inject,
  Input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import RolService from '../../shared/services/rol.service';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'; // Necesario para mat-form-field y mat-label
import { MatInputModule } from '@angular/material/input'; // Para matInput
import { MatButtonModule } from '@angular/material/button';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-editar-usuario',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css',
})
export class EditarUsuarioComponent implements OnInit {
  // @Input({transform:numberAttribute}) id!:number

  userForm: FormGroup;
  roles: any[] = []; // Variable para almacenar los roles obtenidos del backend
  userId: number;

  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private serviceRole = inject(RolService);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      // email: ['', Validators.required, Validators.email],
      email: ['', [Validators.required, Validators.email]], // Validadores síncronos
      roleId: ['', Validators.required],
      password: [''], // campo  opcional
    });
    this.userId = 0; // Inicializamos el ID
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // Cargar roles
    this.serviceRole
      .getRoles(1, 100)
      .pipe(
        switchMap((response) => {
          this.roles = response.roles; // Guardamos la lista de roles
          return this.service.getUserById(this.userId); // Cargar los datos del usuario después
        })
      )
      .subscribe({
        next: (user) => {
          // Buscar el ID del rol basado en el nombre del rol
          const selectedRole = this.roles.find(
            (role) => role.name === user.role
          )?.id;

          // Asignar valores al formulario
          this.userForm.patchValue({
            userName: user.userName,
            email: user.email,
            roleId: selectedRole || '', // Asegurar que no sea undefined
          });
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
          Swal.fire(
            'error',
            'No se pudo cargar los datos del usuario',
            'error'
          );
          this.router.navigate(['/nav/detalle-user']);
        },
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.service.updateUser(this.userId, this.userForm.value).subscribe({
      next: () => {
        Swal.fire('success', 'Usuario actualizado correctamente', 'success');
        this.router.navigate(['/nav/detalle-user']);
      },
      error: (err) => {
        // Mostrar el mensaje de error devuelto por el backend, o un mensaje genérico si no está disponible
        const errorMessage =
          err.error?.message || 'Ocurrió un error al actualizar el usuario.';
        console.error('Error al actualizar usuario:', errorMessage);
        Swal.fire('Error', errorMessage, 'error');
      },
    });
  }
}
