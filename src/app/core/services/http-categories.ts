import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpCategories {
     private http = inject(HttpClient);

    //metodo para obtener todas las categorias
    getCategory(){
    //http siempre devuelve los datos dentro de un observable
    return this.http.get<any>('http://localhost:3000/api/category');
    }
}
