import { HttpInterceptorFn } from '@angular/common/http';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthserviceService);
  const authToken = authService.getCookie('authToken')
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`, // Replace with your token retrieval logic
    },
  });

  // Pass the cloned request instead of the original request to the next handle
  return next(clonedRequest);
};


  

