// cart-drawer.ts
import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../../core/services/http-cart';
import { ImageUrlPipe } from '../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-cart-drawer',
  imports: [AsyncPipe, CurrencyPipe, FaIconComponent, ImageUrlPipe],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css',
})
export class CartDrawer {
  cartService = inject(CartService);
  faXmark = faXmark;
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;

  close() {
    this.cartService.close();
  }

  decrease(productId: string, quantity: number) {
    if (quantity <= 1) return;
    this.cartService.updateQuantity(productId, quantity - 1).subscribe();
  }

  increase(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity + 1).subscribe({
      error: (err) => console.error(err.error?.msg), // cambialo por tu alert.ts
    });
  }

  remove(productId: string) {
    this.cartService.removeItem(productId).subscribe();
  }
}