import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MongoDatePipe } from '../../../core/pipes/mongo-date-pipe';

@Component({
  selector: 'product-list-card',
  imports: [CurrencyPipe, TitleCasePipe, RouterLink],
  template: `
  <div class="user-card">
      <div class="card-cell user-cell">
        <div class="avatar avatar-JC"><img [src]="product.productImage" alt=""></div>
        <span>{{product.name}}</span>
      </div>

      <div class="card-cell">{{product.price | currency:'COP ':'symbol':'1.0'}}</div>
      
      <div class="card-cell">
        <span class="role-badge">{{product.stock}}</span>
      </div>

      @if (product.status == 'disponible'){
        <div class="card-cell">
          <span class="status status-Activo">{{product.status | titlecase}}</span>
        </div>
      }
      @else if (product.status == 'pendiente') {
        <div class="card-cell">
          <span class="status status-Inactivo">{{product.status | titlecase}}</span>
        </div>
      }
      @else{
        <div class="card-cell">
          <span class="status status-Banned">{{product.status | titlecase}}</span>
        </div>
      }

      <div class="card-cell">{{product.nr}}</div>

      <div class="card-cell actions">
        <a class="btn-edit"  (click)="onEditCLick()" [routerLink]="['/products/edit', product._id]">Editar</a>
        <a class="btn-edit" (click)="onDeleteClick()">Eliminar</a>
      </div>
    </div>`,
  styleUrl: './product-list-card.css',
})
export default class ProductListCard {
  @Input() product: any;
  @Output() delete = new EventEmitter<any>()
  @Output() edit = new EventEmitter <string>()

  onDeleteClick(){
    this.delete.emit(this.product)
  }

  onEditCLick(){

    this.edit.emit(this.product._id)

  }
}
