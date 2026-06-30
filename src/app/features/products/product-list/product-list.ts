import { Component, inject, NgZone } from '@angular/core';
import { HttpProducts } from '../../../core/services/http-products';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList {
  products: any[] = []

  // Se injecta la dependecia de el servicio
  private httpProducts = inject(HttpProducts);
  

  ngOnInit() {
    this.httpProducts.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('codigo funciona');
      },
    });
  }
}
