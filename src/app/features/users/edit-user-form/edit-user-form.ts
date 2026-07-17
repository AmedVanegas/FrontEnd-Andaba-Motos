import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpRoles } from '../../../core/services/http-roles';
import { HttpUsers } from '../../../core/services/http-users';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-user-form',
  imports: [ReactiveFormsModule,AsyncPipe],
  templateUrl: './edit-user-form.html',
  styleUrl: './edit-user-form.css',
})
export default class EditUserForm {
  private httpRoles = inject(HttpRoles);
  private router = inject(Router)
  rolesList$ = new BehaviorSubject<any[]>([]);
  userFormData: FormGroup;
  private httpUsers = inject(HttpUsers);
  private activateRoute = inject(ActivatedRoute)
  userId! : any

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
      // password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      // ConfirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
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

  // onSubmit() {
  //   console.group('estados email');
  //   (console.log('valid (userFormData)', this.userFormData?.valid),
  //     console.log('valid (email)', this.userFormData.get('email')?.valid));
  //   console.log('valid (username)', this.userFormData.get('username')?.valid);
  //   console.groupEnd;
  //   if (this.userFormData.valid) {
  //     console.log(this.userFormData.value);
  //     this.httpUsers.editUserbyId(this.userFormData.value, this.userId ).subscribe({
  //       next: (data) => {
  //         console.log(data);
  //         this.userFormData.reset();
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //       complete: () => {
  //         console.log('Usuario editado');
  //       },
  //     });
  //   } else {
  //     console.log('NOOOOOOOO VALIDOOOOOOOOOO');
  //   }
  //   // Muetra os valores
  // }

  onSubmit(){

    this.userFormData.get('birthDate')?.setValue(`${this.userFormData.get('birthDate')?.value}T00:00:00.000+00:00`)


    this.httpUsers.editUserbyId( this.userId , this.userFormData.value).subscribe({
      next:(data)=>{
        console.log(data)
      },
      error:(error)=>{
        console.log(error)
      },
      complete:()=>{
        console.log('se completo el proceso de edicion')
        this.router.navigate(['/users'])
      }
    })
  }

  ngOnInit() {
    //OBSERVABLES
    this.userId = this.activateRoute.snapshot.paramMap.get('id')

    this.getRoles()

    this.loadUserData(this.userId)

    console.log('se cargan los datos')

  }

  getRoles(){
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

  loadUserData(userId: string){

  this.httpUsers.getUserById(userId).subscribe({
    next:(userData: any)=>{
      this.userFormData.patchValue(userData.user)
      console.log(userData.user)
      if (userData.user.birthDate) {
        const date = new Date(userData.user.birthDate);
        const formattedDate = date.toISOString().split('T')[0];
        this.userFormData.get('birthDate')?.setValue(formattedDate)
        console.log(formattedDate)
        userData.user.birthDate = formattedDate;
      }
      
    }
  })

  }

}
