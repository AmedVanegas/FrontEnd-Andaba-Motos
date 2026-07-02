import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './new-user-form.html',
  styleUrl: './new-user-form.css',
})
export default class NewUserForm {
  userFormData: FormGroup;

  constructor() {
    this.userFormData = new FormGroup({
      username: new FormControl(),
      document: new FormControl(),
      birthDate: new FormControl(),
      phoneNumber: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      address: new FormGroup({
        street: new FormControl(),
        carrera: new FormControl(),
        neighborhood: new FormControl(),
        city: new FormControl(),
        department: new FormControl(),
      }),
      rol: new FormControl(),
      status: new FormControl(),
    });
  }

  onSubmit(){

    console.log(this.userFormData.value)

  }
}
