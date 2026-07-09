import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpRoles {
  private http = inject(HttpClient);

  getRoles() {
 
    return this.http.get<any>('http://localhost:3000/api/roles');
  }
}
