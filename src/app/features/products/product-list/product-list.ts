import { Component, inject, NgZone } from '@angular/core';
import { HttpProducts } from '../../../core/services/http-products';
import { AlertService } from '../../../core/services/alert';
import { AsyncPipe, CurrencyPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import ProductListCard from '../product-list-card/product-list-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, ProductListCard, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList {
  products$ = new BehaviorSubject<any[]>([])
  // Se injecta la dependecia de el servicio
  private httpProducts = inject(HttpProducts);
  private alert = inject(AlertService);
  

  ngOnInit() {
    this.httpProducts.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products$.next(data)
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Se traen los productos');
      },
    });
  }

  async onDelete(product: any) {
    const confirmed = await this.alert.confirmDelete('el producto', product.name);
    if (!confirmed) {
      return;
    }

    this.httpProducts.deleteProduct(product._id).subscribe({
      next: (data) => {
        this.alert.success('Eliminado!', 'Producto eliminado');
        console.log(data);
        this.ngOnInit();
      },
      error: (error) => {
        this.alert.error('No se pudo eliminar el producto', error.error?.msg);
        console.log(error);
      },
      complete: () => {
        console.log('se elimino el producto');
      },
    });
  }

  getAllProducts(){
    return this.products$.value.length
  }
  getAvailableProducts(){
    let number = 0
    this.products$.value.forEach(function(product){
      if(product.status == 'disponible'){
        number ++
      }
      
    })
    return number

  }
  getUnavailableProducts(){
    let number = 0
    this.products$.value.forEach(function(product){
      if(product.status == 'no disponible'){
        number ++
      }
      
    })
    return number
  }
  getPendingProducts(){
    let number = 0
    this.products$.value.forEach(function(product){
      if(product.status == 'pendiente'){
        number ++
      }
     
    })

    return number

  }
}
