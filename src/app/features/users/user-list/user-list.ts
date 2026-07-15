import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users';
import { AsyncPipe, JsonPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { BehaviorSubject, Subscription} from 'rxjs';
import { RouterLink } from '@angular/router';
import UserCard from '../user-list-card/user-list-card';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink, UserCard],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList {

  subscriberUser! : Subscription;

  users$ = new BehaviorSubject<any[]>([]);

  private httpUsers = inject(HttpUsers);

  ngOnInit() {
    this.subscriberUser =  this.httpUsers.getUsers().subscribe({
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

  ngOnDestroy(){
    if (this.subscriberUser){

      this.subscriberUser.unsubscribe()

    }
  }
}
