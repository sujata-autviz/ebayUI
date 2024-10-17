import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);  
  const isLoggedIn = authService.isLoggedIn();
  const router = inject(Router);

  if (!isLoggedIn) {
    return true; // Allow access to login page
  }
    router.navigate(['/pages/dashboard']); // Redirect to dashboard if logged in
    return false; // Deny access to login page
};
