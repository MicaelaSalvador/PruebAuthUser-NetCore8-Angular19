import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authRolGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // injectar el router para redireccion

  // recuperar el token del localSrorage
  const token = localStorage.getItem('token');

  // si no hay token, redirigir  a /signin
  if (!token) {
    router.navigate(['/signin']); // Redirigir si no existe token
    return false; // Bloquear el acceso
  }

  try {
    // Decodificar el token JWT (usando atob para la parte del payload)
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodificación del JWT

    // Verificar que el payload contenga el claim del rol
    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // Obtener el rol desde el payload

    // Verificar si el usuario tiene el rol necesario (en este caso 'Admin')
    if (role === 'Admin') {
      return true; // Permitir acceso
    } else {
      // Si no tiene el rol adecuado, mostrar alerta y redirigir
      Swal.fire(
        'Error',
        'No tienes permiso para acceder a esta sección.',
        'error'
      );
      router.navigate(['/nav/detalle-user']); // Redirigir a una ruta alternativa
      return false; // Bloquear el acceso
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    Swal.fire('Error', 'Token inválido o corrupto.', 'error');
    router.navigate(['/signin']); // Redirigir a /signin si el token es inválido
    return false;
  }
};
