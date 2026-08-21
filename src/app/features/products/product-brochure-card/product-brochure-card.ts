import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartService } from '../../../core/services/http-cart';
import { AlertService } from '../../../core/services/alert';
import { ImageUrlPipe } from '../../../core/pipes/image-url.pipe';

@Component({
  selector: 'product-brochure-card',
  imports: [UpperCasePipe, CurrencyPipe, ImageUrlPipe],
  templateUrl: './product-brochure-card.html',
  styleUrl: './product-brochure-card.css',
})
export class ProductBrochureCard {
  cartService = inject(CartService);
  alert = inject(AlertService)
  @Input() product: any;

  @Output() open = new EventEmitter<{ product: any; rect: DOMRect }>();

  constructor(private elRef: ElementRef<HTMLElement>) { }

  onCardClick() {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    this.open.emit({ product: this.product, rect });

  }
  addToCart(event: Event) {
    event.stopPropagation(); 
    this.cartService.addItem(this.product._id, 1).subscribe({
      error: (err) => {
        console.error(err.error?.msg);
        this.alert.error('No se pudo añadir al carrito', err.error?.msg)
      },
    });
  }
}