import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/Users';

@Injectable({ providedIn: 'root' })
export class HttpUsers {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/users';

  getUsers() {
    return this.http
      .get<ResponseUsers>(this.baseUrl)
      .pipe(map((res) => res.data));
  }
}