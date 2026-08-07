// core/services/cart.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    productImages?: string[];
    stock: number;
  };
  quantity: number;
  unitPrice: number;
}

export interface ShoppingCart {
  products: CartItem[];
  price: number;
}

const EMPTY_CART: ShoppingCart = { products: [], price: 0 };

@Injectable({ providedIn: 'root' })
export class CartService {

  private http = inject(HttpClient);

  BASE_URL: string = environment.apiUrl
  private apiUrl = `${this.BASE_URL}/shoppingcar`; // ajusta si usas environment.apiUrl como base

  private cartSubject = new BehaviorSubject<ShoppingCart>(EMPTY_CART);
  cart$ = this.cartSubject.asObservable();

  private openSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.openSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  loadCart() {
    this.http.get<{ data: ShoppingCart }>(this.apiUrl).subscribe({
      next: (res) => this.cartSubject.next(res.data),
      error: () => {}, // sin sesion todavia, el carrito se queda vacio
    });
  }

  addItem(productId: string, quantity = 1) {
    return this.http
      .post<{ data: ShoppingCart }>(`${this.apiUrl}/items`, { product: productId, quantity })
      .pipe(tap((res) => { this.cartSubject.next(res.data); this.open(); }));
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http
      .patch<{ data: ShoppingCart }>(`${this.apiUrl}/items/${productId}`, { quantity })
      .pipe(tap((res) => this.cartSubject.next(res.data)));
  }

  removeItem(productId: string) {
    return this.http
      .delete<{ data: ShoppingCart }>(`${this.apiUrl}/items/${productId}`)
      .pipe(tap((res) => this.cartSubject.next(res.data)));
  }

  clearCart() {
    return this.http
      .delete(this.apiUrl)
      .pipe(tap(() => this.cartSubject.next(EMPTY_CART)));
  }

  checkout(direccionEnvio: string, metodoPago: string) {
    return this.http
      .post(`${this.apiUrl}/checkout`, { direccionEnvio, metodoPago })
      .pipe(tap(() => this.cartSubject.next(EMPTY_CART)));
  }

  open() { this.openSubject.next(true); }
  close() { this.openSubject.next(false); }
  toggle() { this.openSubject.next(!this.openSubject.value); }
}