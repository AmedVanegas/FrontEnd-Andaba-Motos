import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpRoles } from '../../../core/services/http-roles';
import { HttpUsers } from '../../../core/services/http-users';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user-form',
  imports: [ReactiveFormsModule,AsyncPipe],
  templateUrl: './edit-user-form.html',
  styleUrl: './edit-user-form.css',
})
export default class EditUserForm {
  private httpRoles = inject(HttpRoles);
  rolesList$ = new BehaviorSubject<any[]>([]);
  userFormData: FormGroup;
  private httpUsers = inject(HttpUsers);
  private activateRoute = inject(ActivatedRoute)
  userId! : string | null 

  constructor() {
    this.userFormData = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      document: new FormControl('', [Validators.required, Validators.maxLength(16)]),
      birthDate: new FormControl(''),
      phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(13)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      address: new FormGroup(
        {
          street: new FormControl('', [Validators.required]),
          carrera: new FormControl('', [Validators.required]),
          neighborhood: new FormControl('', [Validators.required]),
          city: new FormControl('', [Validators.required]),
          department: new FormControl('', [Validators.required]),
        },
        [Validators.required],
      ),
      rol: new FormControl('client'),
      status: new FormControl('active'),
    });
  }

  onSubmit() {
    console.group('estados email');
    (console.log('valid (userFormData)', this.userFormData?.valid),
      console.log('valid (email)', this.userFormData.get('email')?.valid));
    console.log('valid (username)', this.userFormData.get('username')?.valid);
    console.groupEnd;
    if (this.userFormData.valid) {
      console.log(this.userFormData.value);
      this.httpUsers.editUserbyId(this.userFormData.value, this.userId ).subscribe({
        next: (data) => {
          console.log(data);
          this.userFormData.reset();
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('Usuario editado');
        },
      });
    } else {
      console.log('NOOOOOOOO VALIDOOOOOOOOOO');
    }
    // Muetra os valores
  }

  ngOnInit() {
    //OBSERVABLES

  

    this.userId = this.activateRoute.snapshot.paramMap.get('id')

    this.httpRoles.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.rolesList$.next(roles.roles);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('siempre se ejecuta');
      },
    });
  }
}
