import { Component, inject } from '@angular/core';
import { HttpProducts } from '../../core/services/http-products';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CurrencyPipe, UpperCasePipe} from '@angular/common';
import { ProductBrochureCard } from '../products/product-brochure-card/product-brochure-card';
import { ProductBrochureDetail } from '../products/product-brochure-detail/product-brochure-detail';

@Component({
  selector: 'app-brochure',
  imports: [ AsyncPipe, ProductBrochureCard, ProductBrochureDetail],
  templateUrl: './brochure.html',
  styleUrl: './brochure.css',
})
export  default class Brochure {

  private httpProducts = inject(HttpProducts)
  products$ = new BehaviorSubject<any[]>([])

  // Producto seleccionado para el panel de detalle + rect de la card
  // que se clickeó (punto de partida de la animación).
  selectedProduct: any = null;
  originRect: DOMRect | null = null;

  ngOnInit(){
    this.httpProducts.getProducts().subscribe(
      {next: (products)=>{
        this.products$.next(products)
        console.log(products)
      },
      error: (error)=> {
        console.log(error)
      },
      complete: ()=>{
        console.log('Se trajeron los datos')
      }
    }

    )
  }

  onOpenDetail(event: { product: any; rect: DOMRect }) {
    this.originRect = event.rect;
    this.selectedProduct = event.product;
    document.body.style.overflow = 'hidden';
  }

  onCloseDetail() {
    this.selectedProduct = null;
    this.originRect = null;
    document.body.style.overflow = '';
  }
}