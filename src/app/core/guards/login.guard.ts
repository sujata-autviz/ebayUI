import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { ComponentFactoryResolver, inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const islogedIn = authService.isLoggedIn();
  const router = inject(Router);

  if (!islogedIn) {
    return true; // User is not logged in, allow access to login
  } else {
    router.navigate(['/dashboard']); // Redirect to the dashboard if already logged in
    return false; // Deny access to the login page
  }
  
};
