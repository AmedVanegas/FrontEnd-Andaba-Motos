import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { ResponseProducts } from '../models/Products';

@Service()
export class HttpProducts {
  private http = inject(HttpClient);

  getProducts() {
    return this.http.get<any>('http://localhost:3000/api/products').pipe(
        tap( (res) => {
                console.log('yes' )
              }),
              map((res) => {
                return res.data;
              }),
              catchError((error)=>{
                return of([])
              })
        
    );
  }
  deleteProduct(id:string){
    return this.http.delete(`http://localhost:3000/api/products/${id}`)

  }
  getProductById(id:string){
    return this.http.get<any>(`http://localhost:3000/api/products/${id}`)
  }
  editProduct(id:string, updateData:string){

    return this.http.patch(`http://localhost:3000/api/products/${id}`,updateData)

  }
  createProducts(newProduct:any){
    return this.http.post('http://localhost:3000/api/products', newProduct);
}

  
}

