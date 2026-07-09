import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';

@Service()
export class HttpUsers {
  // constructor(private http: HttpClient ){} version antigua

  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<any>('http://localhost:3000/api/users').pipe(
      map((res) => {
        return res.data;
      }),
    );
  }

  createUser(newUser:any){

    return this.http.post<any>('http://localhost:3000/api/users', newUser)


  }
}
