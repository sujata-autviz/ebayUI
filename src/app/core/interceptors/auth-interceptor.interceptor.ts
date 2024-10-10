import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${getToken()}`, // Replace with your token retrieval logic
    },
  });

  // Pass the cloned request instead of the original request to the next handle
  return next(clonedRequest);
};

// Function to get the token from local storage or other storage
const getToken = (): string => {
  return localStorage.getItem('token') || '';
};

  

