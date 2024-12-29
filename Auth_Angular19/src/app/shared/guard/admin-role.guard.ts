import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';

export const adminRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {


  const token = localStorage.getItem('token'); // Obtener el token del localStorage

  if (token) {
    try {
      // Decodificar el token JWT sin librerías adicionales
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT

      // Comprobar si el rol del usuario es "Admin"
      if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin') {
        return true; // El rol es Admin, permitir el acceso
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

   // Si el token no existe o el rol no es Admin, redirigir a otra página
   Swal.fire('Acceso Denegado', 'No tienes permisos para acceder a esta página.', 'error');

   const router = inject(Router); // Usar inyección de dependencias para obtener Router
   router.navigate(['/nav/detalle-rol']); // Redirigir al usuario
   return false; // Bloquear el acceso
  
};
