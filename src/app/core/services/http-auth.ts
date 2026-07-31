import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';

@Service()
export class HttpAuth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private BASE_URL = environment.apiUrl;
  private platformId = inject(PLATFORM_ID); 

  currentUser$ = new BehaviorSubject<any>(null);
  currentToken$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.getDataLocalStorage();
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, { username, password }).pipe(
      tap((res) => {
        if (res?.token && res?.data) {
          this.saveDataLocalStorage(res.token, res.data);

          this.router.navigateByUrl('/dashboard');
        }
      }),
      map((res) => res.msg),
      catchError((err: HttpErrorResponse) => {
        !err.error?.msg ? (err.error.msg = 'No se pudo iniciar sesión') : console.log('si viene');

        console.log(err.error?.msg);

        return throwError(() => err);
      }),
    );
  }

  saveDataLocalStorage(token: string, user: {}) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUser$.next(user);
    this.currentToken$.next(token);
  }

  getDataLocalStorage(): any {
    let token;
    let user;

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
      const userRaw = localStorage.getItem('user');
      user = userRaw ? JSON.parse(userRaw) : null;

      this.currentToken$.next(token);
      this.currentUser$.next(user);

      return {
        token,
        user,
      };
    }
  }

  deleteDataLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    this.currentToken$.next(null);
    this.currentUser$.next(null);
  }

  isLogged() {
    return !!this.currentUser$.value;
  }

  logoutUser() {
    this.deleteDataLocalStorage();
    this.router.navigateByUrl('/home');
  }
}
