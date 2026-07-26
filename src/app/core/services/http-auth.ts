import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

@Service()
export class HttpAuth {
    private http = inject(HttpClient);
  BASE_URL = environment.apiUrl;

  login(username: string, password: string) {
    return this.http.post<any>(`${this.BASE_URL}/auth/login`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.data));
      }),
    );
  }
}
