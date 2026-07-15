import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MongoDatePipe } from '../../../core/pipes/mongo-date-pipe';

@Component({
  selector: 'user-list-card',
  imports: [RouterLink, TitleCasePipe, MongoDatePipe],
  template: `
    <div class="user-card">
      <div class="card-cell user-cell">
        <div class="avatar avatar-JC">{{user.username.slice(0,2)}}</div>
        <span>{{user.username}}</span>
      </div>

      <div class="card-cell">{{user.email}}</div>
      
      <div class="card-cell">
        <span class="role-badge">{{user.rol}}</span>
      </div>

      @if (user.status == 'active'){
        <div class="card-cell">
          <span class="status status-Activo">{{user.status | titlecase}}</span>
        </div>
      }
      @else if (user.status == 'inactive') {
        <div class="card-cell">
          <span class="status status-Inactivo">{{user.status | titlecase}}</span>
        </div>
      }
      @else{
        <div class="card-cell">
          <span class="status status-Banned">{{user.status | titlecase}}</span>
        </div>
      }

      <div class="card-cell">{{user.createdAt | mongoDate}}</div>

      <div class="card-cell actions">
        <a class="btn-edit" [routerLink]="['/edit-user-form', user._id]">Editar</a>
        <button class="btn-edit" (click)="onClick()">Eliminar</button>
      </div>
    </div>
  `,
  styleUrl: './user-list-card.css'
})
export default class UserCard {
  @Input() user: any;
  @Output() userDeleteId = new EventEmitter<string>();

  onClick() {
    this.userDeleteId.emit(this.user._id);
  }
}