import { HttpClient } from '@angular/common/http'; 
import { inject, Service } from '@angular/core'; 
import { environment } from '../../../environments/environment'; 
import { tap } from 'rxjs';

@Service() 
export class HttpAppointments {

  private http = inject(HttpClient); 

  BASE_URL: string = environment.apiUrl; 

  getAppointments() {
    return this.http.get<any>(`${this.BASE_URL}/appointment`).pipe(tap((res)=>{console.log(res)}));
  }

}
