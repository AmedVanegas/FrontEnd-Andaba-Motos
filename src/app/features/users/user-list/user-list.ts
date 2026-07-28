import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { HttpUsers } from '../../../core/services/http-users';
import { AlertService } from '../../../core/services/alert';
import UserCard from '../user-list-card/user-list-card';
import UserForm from '../user-form/user-form';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink, UserCard, FontAwesomeModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
  // Atributos de clase fontAwesome

  faCoffee = faUser;

  subscriberUser!: Subscription;

  subscriberDeleteUser!: Subscription;

  subscriberUpdateuser!: Subscription;

  users$ = new BehaviorSubject<any[]>([]);

  private httpUsers = inject(HttpUsers);
  private alert = inject(AlertService);

  ngOnInit() {
    this.loadUsers();
  }
  async onDelete(user: any) {
    const confirmed = await this.alert.confirmDelete('el usuario', user.username);
    if (!confirmed) {
      return;
    }

    this.subscriberDeleteUser = this.httpUsers.deleteUserbyId(user._id).subscribe({
      next: (data) => {
        this.alert.success('Eliminado!', 'Usuario eliminado');
        console.log(data);
        this.loadUsers();
      },
      error: (error) => {
        this.alert.error('No se pudo eliminar el usuario', error.error?.msg);
        console.error(error);
      },
      complete: () => {
        console.log('eliminado');
      },
    });
  }

  onEdit(userId: string) {}

  getAllUsers() {
    return this.users$.value.length;
  }
  getBannedUsers() {
    let number: number = 0;

    this.users$.value.forEach(function (user) {
      if (user.status == 'banned') {
        number++;
      }
    });
    return number;
  }
  getActiveUsers() {
    let number: number = 0;

    this.users$.value.forEach(function (user) {
      if (user.status == 'active') {
        number++;
      }
    });
    return number;
  }
  getInactiveUsers() {
    let number: number = 0;

    this.users$.value.forEach(function (user) {
      if (user.status == 'inactive') {
        number++;
      }
    });
    return number;
  }

  getUsername(userId:string){

  }

  ngOnDestroy() {
    if (this.subscriberUser) {
      this.subscriberUser.unsubscribe();
      return console.log('se elmino la sub');
    }
    if (this.subscriberDeleteUser) {
      this.subscriberDeleteUser.unsubscribe();
      return console.log('se elimino la sub');
    }
  }
  private loadUsers() {
    this.subscriberUser = this.httpUsers.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.users$.next(data);
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
