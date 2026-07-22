import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users';
import { AsyncPipe, JsonPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import UserCard from '../user-list-card/user-list-card';

import Swal from 'sweetalert2';
import UserForm from '../user-form/user-form';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink, UserCard],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
  subscriberUser!: Subscription;

  subscriberDeleteUser!: Subscription;

  subscriberUpdateuser!: Subscription;

  users$ = new BehaviorSubject<any[]>([]);

  private httpUsers = inject(HttpUsers);

  ngOnInit() {
    this.loadUsers();
  }
  onDelete(user: any) {
    //confimacion yupiu

    Swal.fire({
      title: `¿ Seguro que quiere eliminar el usuario ${user.username} ?`,
      text: 'No se puede deshacer!',
      color:'#fff',
      background:'#000000' ,
      icon: 'warning',
      iconColor:'#d33',      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#5e5e5e',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado!',
          text: 'Usuario eliminado',
          background:'#000000' ,
          icon: 'success',
          color:'#fff',
          confirmButtonColor:'#5e5e5e'
        });

        this.subscriberDeleteUser = this.httpUsers.deleteUserbyId(user._id).subscribe({
          next: (data) => {
            console.log(data);
            this.loadUsers();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => {
            console.log('eliminado');
          },
        });
      }
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
