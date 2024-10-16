import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);  
  const islogedIn = authService.isLoggedIn()
  const router = inject(Router);   
  if (islogedIn) {
    console.log('-------- auth ---', false)
    return true; 
  } else {
    console.log('-------- auth ---', false)
    router.navigate(['/account/login']);
    return false;  // Deny access
  }
};
