import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

 export interface UserResponseDto {
  id: number;
  userName: string;
  email: string;
  role: string;
}

 export interface UserListResponse {
  totalRecords: number;
  users: UserResponseDto[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  constructor(private http: HttpClient) {}
  private URLbase = environment.apiURL + '/api';

  getUsers(pageNumber: number, pageSize: number): Observable<UserListResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'), // Suponiendo que el token se guarda en localStorage
    });

    return this.http.get<UserListResponse>(`${this.URLbase}/User`, {
      params,
      headers,
    });
  }

  
  // Obtener  Usuario  por ID
  getUserById(id:number):Observable<any>{
    return this.http.get(`${this.URLbase}/User/${id}`);
  }

  //Actualizar  usuario
  updateUser(id:number,userData:any) :Observable<any>{
    return this.http.put(`${this.URLbase}/User/${id}`, userData);
  }


  // Método para eliminar usuario
  deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas token JWT para autorización
    });
    return this.http.delete(`${this.URLbase}/User/${userId}`, {headers});
  }

}
