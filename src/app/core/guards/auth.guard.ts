import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);  // Injecting AuthService
  const router = inject(Router);            // Injecting Router
  if (authService.isLoggedIn()) {
    return true;  // If the user is authenticated, allow access
  } else {
    // If the user is not authenticated, redirect to the login page
    router.navigate(['/account/login']);
    return false;  // Deny access
  }
};
