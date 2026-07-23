import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpRoles } from '../../../core/services/http-roles';
import { HttpUsers } from '../../../core/services/http-users';
import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, AsyncPipe, NgClass, CommonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export default class UserForm implements OnInit {
  private httpRoles = inject(HttpRoles);
  private httpUsers = inject(HttpUsers);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  rolesList$ = new BehaviorSubject<any[]>([]);
  userFormData: FormGroup;

  // Variables que cambian

  isEditMode = false;
  userId: string | null = null;
  pageTitle = 'Registro Usuario';
  submitButtonText = 'Crear usuario';

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
      password: new FormControl(''),
      ConfirmPassword: new FormControl(''),
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

  ngOnInit() {
    this.getRoles();

    // Toma el id de la ruta si existe
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.userId) {
      // Si si existe user id, significa que esta en edit, se activa, se cambia el titulo y el texto del boton
      this.isEditMode = true;
      this.pageTitle = 'Editar usuario';
      this.submitButtonText = 'Editar';

      // se desactiva la validacion de la contraseña
      this.userFormData.get('password')?.clearAsyncValidators();
      this.userFormData.get('ConfirmPassword')?.clearAsyncValidators();

      //Carga los datos del usuario
      this.loadUserData(this.userId);
    } else {
      // si no existe el user id, esta en modo de crear user, se pone en falso, cambia el titulo y el boton

      // Hace que los campos de contraseña sean requeridos
      this.userFormData.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
      this.userFormData.get('ConfirmPassword')?.setValidators([
        Validators.required,
        Validators.minLength(8),
      ]);
    }

    this.userFormData.updateValueAndValidity();
  }

  onSubmit() {
    if (this.userFormData.valid) {
      const formValue = this.userFormData.value;

  
      if (formValue.birthDate) {
        formValue.birthDate = `${formValue.birthDate}T00:00:00.000+00:00`;
      }

      if (this.isEditMode && this.userId) {
        // si el modo de ecicion esat activo, activa el services de edit
        this.httpUsers.editUserbyId(this.userId, formValue).subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            console.log('Usuario actualizado');
            this.router.navigate(['/users']);
          },
        });
      } else {
        // si no activa el service de create
        this.httpUsers.createUser(formValue).subscribe({
          next: (data) => {
            console.log(data);
            this.userFormData.reset();
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            console.log('Usuario creado');
            this.router.navigate(['/users']);
          },
        });
      }
    }
  }

  getRoles() {
    this.httpRoles.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.rolesList$.next(roles.roles);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Roles cargados');
      },
    });
  }

  loadUserData(userId: string) {
    this.httpUsers.getUserById(userId).subscribe({
      next: (userData: any) => {
        this.userFormData.patchValue(userData.user);
        console.log(userData.user);

        if (userData.user.birthDate) {
          const date = new Date(userData.user.birthDate);
          const formattedDate = date.toISOString().split('T')[0];
          this.userFormData.get('birthDate')?.setValue(formattedDate);
          console.log(formattedDate);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }


  get name() {
    return this.userFormData.get('username');
  }

  get document() {
    return this.userFormData.get('document');
  }

  get birthDate() {
    return this.userFormData.get('birthDate');
  }

  get phoneNumber() {
    return this.userFormData.get('phoneNumber');
  }

  get email() {
    return this.userFormData.get('email');
  }

  get password() {
    return this.userFormData.get('password');
  }

  get confirmPassword() {
    return this.userFormData.get('ConfirmPassword');
  }

  get addressGroup() {
    return this.userFormData.get('address');
  }
}