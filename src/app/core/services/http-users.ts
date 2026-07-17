import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

@Service()
export class HttpUsers {
  // constructor(private http: HttpClient ){} version antigua

  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<any>('http://localhost:3000/api/users').pipe(
      tap( (res) => {
        console.log( res )
      }),
      map((res) => {
        return res.data;
      }),
      catchError((error)=>{
        return of([])
      })
    );
  }

  createUser(newUser:any){

    return this.http.post<any>('http://localhost:3000/api/users', newUser)


  }

  deleteUserbyId (userId:string){

    return this.http.delete(`http://localhost:3000/api/users/${userId}`)

  }

  editUserbyId (userId:string | null, editData:any){

    return this.http.patch(`http://localhost:3000/api/users/${userId}`, editData)

  }

  getUserById (userId: any){

    return this.http.get(`http://localhost:3000/api/users/${userId}`)

  }
}
