import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Verificar  si el token esta  presente en el local  storage
  const token = localStorage.getItem('token');

  //  si el token no existe , redirige a  la  pagina de  inicio de sesion

  if (!token) {
    router.navigate(['/signin']);
    return false;
  }

  // si el token existe, permite el acceso
  return true;
};
