import { AsyncPipe, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'product-brochure-card',
  imports: [UpperCasePipe, CurrencyPipe],
  templateUrl: './product-brochure-card.html',
  styleUrl: './product-brochure-card.css',
})
export class ProductBrochureCard {
  @Input() product:any
}
