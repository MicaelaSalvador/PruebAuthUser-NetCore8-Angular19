import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // recuperar el token  del almacenamiento local
  const token = localStorage.getItem('token');
  const router = inject(Router); // Inyectar Router para redirigir en caso de error

  // Si existe un token, clonar la solicitud para agregar el encabezado Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Token incluido en el encabezado
      },
    });
  }
  // Manejo de la solicitud y captura de errores
  return next(req).pipe(
    catchError((error) => {
      // Manejo de errores específicos
      if (error.status === 401) {
        console.error(
          'Error 401: No autorizado. Redirigiendo al inicio de sesión.'
        );
        // alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        Swal.fire(
          'Error',
          'Tu  sesion ha expirado. Por  favor, Inicia sesión nuevamente.',
          'error'
        );
        router.navigate(['/signin']); // Redirige al login
      } else if (error.status === 403) {
        console.error(
          'Error 403: Acceso denegado. Redirigiendo a la página de inicio.'
        );
        // alert('No tienes permiso para acceder a este recurso.');
        Swal.fire(
          'Error',
          'No tienes permiso para acceder a este recurso.',
          'error'
        );
        router.navigate(['/']); // Redirige al inicio
      } else {
        console.error('Error desconocido:', error.message);
        // alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
        Swal.fire(
          'Error',
          'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
          'error'
        );
      }

      // Propaga el error
      return throwError(() => error);
    })
  );
};
