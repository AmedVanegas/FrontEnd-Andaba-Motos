import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseAppointments } from '../models/Appointment';

@Injectable({ providedIn: 'root' })
export class HttpAppointment {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/appointment';

  getAppointment() {
    return this.http
      .get<ResponseAppointments>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  createAppointment(payload: any) {
    return this.http.post(this.baseUrl, payload);
  }
}