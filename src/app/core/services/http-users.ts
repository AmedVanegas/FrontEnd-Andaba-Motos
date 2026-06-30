import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpUsers {
  // constructor(private http: HttpClient ){} version antigua

  private http = inject(HttpClient);

  getUsers() {
    return this.http.get('http://localhost:3000/api/users');
  }
}
