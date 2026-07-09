import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseServices } from '../models/service';

@Injectable({ providedIn: 'root' })
export class HttpServices {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/services';

  getServices() {
    return this.http
      .get<ResponseServices>(this.baseUrl)
      .pipe(map((res) => res.data));
  }
}