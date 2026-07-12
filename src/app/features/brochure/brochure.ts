import { Component, inject } from '@angular/core';
import { HttpProducts } from '../../core/services/http-products';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CurrencyPipe, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-brochure',
  imports: [ AsyncPipe, UpperCasePipe, CurrencyPipe],
  templateUrl: './brochure.html',
  styleUrl: './brochure.css',
})
export  default class Brochure {

  private httpProducts = inject(HttpProducts)
  products$ = new BehaviorSubject<any[]>([])





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
}
