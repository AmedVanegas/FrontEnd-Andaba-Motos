import { Component, inject } from '@angular/core';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { HttpUsers } from '../../../core/services/http-users';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-appointment-form',
  imports: [AsyncPipe],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export default class AppointmentForm {
  httpMotorcycles = inject(HttpMotorcycles);
  httpUsers = inject(HttpUsers);
  usersList$ = new BehaviorSubject<any[]>([]);
  motorcycleslist$ = new BehaviorSubject<any[]>([]);

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      client: new FormControl(''),
      motorcycle: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.httpUsers.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.usersList$.next(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onClientChange(clientId: string) {
    this.formData.get('motorcycle')?.setValue('');
    this.motorcycleslist$.next([]);

    if (!clientId) return;

    this.httpMotorcycles.getMotorcycleByUserId(clientId).subscribe({
      next: (value) => {
        console.log(value.motorcycles);
        this.motorcycleslist$.next(value.motorcycles);
      },
    });
  }
}
