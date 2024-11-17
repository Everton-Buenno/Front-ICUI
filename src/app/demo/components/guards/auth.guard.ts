import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; 
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router); 
  // Verifique se o usuário está autenticado
  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth/login']); 
    return false; 
  }
};
