import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);  
  const isLoggedIn = authService.isLoggedIn();
  const router = inject(Router);

  if (isLoggedIn) {
    return true; // Allow access to protected route
  }
  // router.navigate(['/account/login'])
  return false; // Deny access
};
