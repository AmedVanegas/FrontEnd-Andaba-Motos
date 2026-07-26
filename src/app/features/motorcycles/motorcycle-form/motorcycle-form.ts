import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpUsers } from '../../../core/services/http-users';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-motorcycle-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './motorcycle-form.html',
  styleUrl: './motorcycle-form.css',
})
export default class MotorcycleForm {
  private httpUsers = inject(HttpUsers);
  clientList$ = new BehaviorSubject<any[]>([]);
  private httpMotorcycles = inject(HttpMotorcycles);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  formData: FormGroup;

  isEditMode = false;
  formTitle: string = 'Registrar motocicleta';
  formButton: string = 'Crear motocicleta';
  motorcycleId: string | null = null;

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      licensePlate: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      brand: new FormControl('', [Validators.required]),
      modelName: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      client: new FormControl('', Validators.required),
      status: new FormControl(true, Validators.required),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      const formValue = this.formData.value;

      if (this.isEditMode && this.motorcycleId) {
        this.httpMotorcycles.editMotorcycle(this.motorcycleId, formValue).subscribe({
          next: (data) => {
            console.log(data);
            this.router.navigate(['/motorcycles']);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {},
        });
      } else {
        this.httpMotorcycles.createMotorcycle(this.formData.value).subscribe({
          next: (res) => {
            console.log(res);
            this.formData.reset();
            this.router.navigate(['/motorcycles']);
          },

          error: (error) => {
            console.log(error);
          },

          complete: () => {
            console.log('complete execute');
          },
        });
      }
    }
  }

  // Hook: ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit() {
    this.loadClients();

    this.motorcycleId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.motorcycleId) {
      this.loadMotorcycle(this.motorcycleId);
      this.isEditMode = true;
      this.formTitle = 'Editar motocicleta';
      this.formButton = 'Editar';
    }
  }

  // Trae solo los usuarios con rol "client" para el selector de dueño
  loadClients() {
    this.httpUsers.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.clientList$.next(data.filter((user: any) => user.rol === 'client'));
      },

      error: (err) => {
        console.log(err);
      },

      complete: () => {
        // No hay acciones al completar
      },
    });
  }

  loadMotorcycle(motorcycleId: string) {
    this.httpMotorcycles.getMotorcycleById(motorcycleId).subscribe({
      next: (data: any) => {
        const { motorcycle } = data;
        this.formData.patchValue(motorcycle);
      },
      error: () => {},
      complete: () => {},
    });
  }

  get licensePlate() {
    return this.formData.get('licensePlate');
  }

  get brand() {
    return this.formData.get('brand');
  }

  get modelName() {
    return this.formData.get('modelName');
  }

  get color() {
    return this.formData.get('color');
  }

  get client() {
    return this.formData.get('client');
  }
}
