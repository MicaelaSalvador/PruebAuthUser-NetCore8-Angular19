import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


// Definir la interfaz para la respuesta de la API
export interface RoleListResponse {
  totalRecords: number;
  roles: RoleResponseDto[];
}

export interface RoleResponseDto {
  id: number;
  name: string;
}

export interface RoleDto {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export default class RolService {
  constructor(private http: HttpClient) {}
  private URLbase = environment.apiURL + '/api';

  // Crear un nuevo rol
  createRole(roleDto: RoleDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.URLbase}/Roles`, roleDto, { headers });
  }

  getRoles(pageNumber: number, pageSize: number): Observable<RoleListResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    console.log('Parametros enviados:', params.toString()); // Agregar esta línea para verificar los parámetros

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'), // Token de autenticación
    });

    return this.http.get<RoleListResponse>(`${this.URLbase}/Roles`, {
      params,
      headers,
    });
  }

  // Método para actualizar un rol
  updateRole(id: number, role: RoleDto): Observable<any> {
    const url = `${this.URLbase}/Roles/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de incluir el token de autenticación
    });
    return this.http.put(url, role, { headers });
  }

  // Método para obtener un rol por ID
  // getRoleById(id: number): Observable<RoleDto> {
  //   const url = `${this.URLbase}/Roles/${id}`;
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   });
  //   return this.http.get<RoleDto>(url, { headers });
  // }

  // Método para obtener el rol por ID
  getRoleById(id: number): Observable<RoleDto> {
    const url = `${this.URLbase}/Roles/${id}`;
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<RoleDto>(url, { headers }).pipe(
      catchError(err => {
        // Manejar error si la petición falla
        return throwError(() => new Error('Error al obtener el rol'));
      })
    );
  }

  deleteRole(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.URLbase}/Roles/${id}`;
    return this.http.delete(url, { headers }).pipe(
      catchError(err => {
        // Manejar error si la petición falla
        return throwError(() => new Error('Error al eliminar el rol'));
      })
    );
  }

  // // Eliminar un rol
  // deleteRole(id: number): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: 'Bearer ' + localStorage.getItem('token'),
  //   });

  //   return this.http.delete(`${this.URLbase}/Roles/${id}`, { headers });
  // }

}
