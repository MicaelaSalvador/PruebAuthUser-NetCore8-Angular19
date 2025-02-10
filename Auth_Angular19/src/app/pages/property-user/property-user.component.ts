import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import {
  UserListResponse,
  UserService,
} from '../../shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-user',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './property-user.component.html',
  styleUrl: './property-user.component.css',
})
export class PropertyUserComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'email', 'role', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers(1, 10); // Cargar la primera página de usuarios
  }

  loadUsers(pageNumber: number, pageSize: number): void {
    this.userService.getUsers(pageNumber, pageSize).subscribe({
      next: (response: UserListResponse) => {
        console.log('Respuesta del backend:', response);

        // Actualizar los roles en la tabla
        this.dataSource.data = response.users;

        // Actualizar el total de registros
        this.totalRecords = response.totalRecords;
      },
      error: (error) => {
        // Manejar errores en la carga de roles
        // console.error('Error al cargar roles:', error);
        Swal.fire('error', 'Error al cargar roles:', 'error');
      },
      complete: () => {
        // Acción cuando la suscripción se completa (opcional)
        console.log('Carga de roles completada');
      },
    });
  }

  // Evento del paginador
  pageChanged(event: PageEvent): void {
    const pageNumber = event.pageIndex + 1; // pageIndex es basado en cero
    const pageSize = event.pageSize;

    console.log('Página actual:', pageNumber);
    console.log('Tamaño de página:', pageSize);
    this.loadUsers(pageNumber, pageSize); // Recargar datos
  }

  // Verificar si el usuario tiene el rol Admin
  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        return (
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] === 'Admin'
        );
      } catch (error) {
        console.error('Error al verificar el rol:', error);
        return false;
      }
    }
    return false;
  }

  // Confirmar la eliminación de un usuario
  confirmDelete(id: number, userName: string): void {
    if (!this.isAdmin()) {
      Swal.fire(
        'Acceso Denegado',
        'No tienes permisos para eliminar usuarios.',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario: ${userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(id);
      }
    });
  }

  // Eliminar usuario
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        Swal.fire(
          'Eliminado',
          'El usuario ha sido eliminado con éxito.',
          'success'
        );
        this.loadUsers(1, 10); // Recargar la tabla después de eliminar
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      },
    });
  }
}
