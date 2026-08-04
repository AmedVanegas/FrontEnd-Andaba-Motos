import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpAuth } from '../services/http-auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const httpAuth = inject(HttpAuth)

  const token = httpAuth.token
  // const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Token: token } }));
};
