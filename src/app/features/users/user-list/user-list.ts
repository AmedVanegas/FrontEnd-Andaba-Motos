import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users';
import { AsyncPipe, JsonPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink, TitleCasePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {
  users$ = new BehaviorSubject<any[]>([]);

  private httpUsers = inject(HttpUsers);

  ngOnInit() {
    this.httpUsers.getUsers().subscribe({
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
  onDelete(userId: string) {
    this.httpUsers.deleteUserbyId(userId).subscribe({
      next: (data) => {
        console.log(data);
        this.ngOnInit();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('eliminado');
      },
    });
  }

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

}
