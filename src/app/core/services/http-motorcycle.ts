// http-motorcycles.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseMotorcycles } from '../models/Motorcycle';

@Injectable({ providedIn: 'root' })
export class HttpMotorcycles {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/motorcycles';

  getMotorcycles() {
    return this.http
      .get<ResponseMotorcycles>(this.baseUrl)
      .pipe(map((res) => res.data));
  }
}