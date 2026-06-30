import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { ResponseProducts } from '../models/Products';

@Service()
export class HttpProducts {
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<ResponseProducts>('http://localhost:3000/api/products').pipe(
        map((res)=> res.data)
    );
  }
}
