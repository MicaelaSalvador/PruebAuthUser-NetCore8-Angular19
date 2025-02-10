import { Component, OnInit, ViewChild } from '@angular/core';
import RolService, {
  RoleListResponse,
  RoleResponseDto,
} from '../../shared/services/rol.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-property-rol',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './property-rol.component.html',
  styleUrl: './property-rol.component.css',
})
export class PropertyRolComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'acciones']; // Columnas de la tabla
  dataSource = new MatTableDataSource<any>(); // Fuente de datos de la tabla
  totalRecords: number = 0; // Total de roles para la paginación

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Para la paginación
  @ViewChild(MatSort) sort!: MatSort; // Para la ordenación

  constructor(private service: RolService, private router: Router) {}

  ngOnInit(): void {
    this.loadRoles(1, 10); // Cargar la primera página de roles
  }

  // Método para cargar los roles con paginación
  loadRoles(pageNumber: number, pageSize: number): void {
    this.service.getRoles(pageNumber, pageSize).subscribe({
      next: (response: RoleListResponse) => {
        this.dataSource.data = response.roles; // Actualizar datos en la tabla
        this.totalRecords = response.totalRecords; // Actualizar total de registros
      },
      error: () => {
        Swal.fire('Error', 'Error al cargar roles.', 'error');
      },
    });
  }

  // Método para verificar si el usuario tiene el rol Admin
  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT manualmente
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

  // Confirmación para eliminar un rol
  confirmDelete(id: number, name: string): void {
    if (!this.isAdmin()) {
      Swal.fire(
        'Acceso denegado',
        'No tienes permisos para eliminar roles.',
        'error'
      );
      return; // Si el usuario no es Admin, no permitir eliminar
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el rol: ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRole(id); // Eliminar el rol
      }
    });
  }

  // Método para eliminar un rol
  deleteRole(roleId: number): void {
    this.service.deleteRole(roleId).subscribe({
      next: () => {
        Swal.fire(
          'Eliminado',
          'El rol ha sido eliminado con éxito.',
          'success'
        );
        this.dataSource.data = this.dataSource.data.filter(
          (role: any) => role.id !== roleId
        ); // Eliminar localmente
      },
      error: () => {
        Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
      },
    });
  }

  pageChanged(event: PageEvent): void {
    const pageNumber = event.pageIndex + 1; // pageIndex es basado en cero
    const pageSize = event.pageSize;

    console.log('Página actual:', pageNumber);
    console.log('Tamaño de página:', pageSize);
    this.loadRoles(pageNumber, pageSize); // Recargar datos
  }
}
