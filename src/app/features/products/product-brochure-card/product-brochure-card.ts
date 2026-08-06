import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'product-brochure-card',
  imports: [UpperCasePipe, CurrencyPipe],
  templateUrl: './product-brochure-card.html',
  styleUrl: './product-brochure-card.css',
})
export class ProductBrochureCard {
  @Input() product: any;

  // Emite el producto + el rect de la card en pantalla, para que el
  // detalle sepa desde dónde "nacer" en la animación.
  @Output() open = new EventEmitter<{ product: any; rect: DOMRect }>();

  constructor(private elRef: ElementRef<HTMLElement>) { }

  onCardClick() {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    this.open.emit({ product: this.product, rect });
  }
}