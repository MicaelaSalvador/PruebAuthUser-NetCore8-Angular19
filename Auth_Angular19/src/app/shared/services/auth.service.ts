import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface LoginResponse {
  message: string;
  result: boolean;
  data: { token: string };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private URLbase = environment.apiURL + '/api';

  createUser(formData: any) {
    return this.http.post(`${this.URLbase}/Auth/register`, formData);
  }

  signin(email: string, password: string): Observable<LoginResponse> {
    const loginData = { email, password };

    return this.http.post<LoginResponse>(
      `${this.URLbase}/Auth/login`,
      loginData
    );
  }

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Método para limpiar el token al cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }
}
