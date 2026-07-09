import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpAppointment } from '../../core/services/http-appointment';
import { HttpUsers } from '../../core/services/http-users';
import { HttpServices } from '../../core/services/http-services';
import { HttpMotorcycles } from '../../core/services/http-motorcycles';
import { UserItem } from '../../core/models/User';
import { ServiceItem } from '../../core/models/Service';
import { MotorcycleItem } from '../../core/models/Motorcycle';

@Component({
  selector: 'app-appointment-new-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-new-form.html',
  styleUrl: './appointment-new-form.css',
})
export default class AppointmentNewForm implements OnInit {
  private httpAppointment = inject(HttpAppointment);
  private httpUsers = inject(HttpUsers);
  private httpServices = inject(HttpServices);
  private httpMotorcycles = inject(HttpMotorcycles);

  // Listas para llenar los <select> del HTML
  users = signal<UserItem[]>([]);
  services = signal<ServiceItem[]>([]);
  motorcycles = signal<MotorcycleItem[]>([]);

  // Estado del envío del formulario
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  formData = new FormGroup({
    client: new FormControl('', [Validators.required]),
    service: new FormControl('', [Validators.required]),
    motorcycle: new FormControl(''),
    schedule: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadServices();
    this.loadMotorcycles();
  }

  loadUsers(): void {
    this.httpUsers.getUsers().subscribe({
      next: (data: any) => this.users.set(data as UserItem[]),
      // El backend responde error 400 si no hay usuarios registrados;
      // en ese caso dejamos la lista vacía en vez de romper el formulario.
      error: () => this.users.set([]),
    });
  }

  loadServices(): void {
    this.httpServices.getServices().subscribe({
      next: (data: any) => this.services.set(data as ServiceItem[]),
      error: () => this.services.set([]),
    });
  }

  loadMotorcycles(): void {
    this.httpMotorcycles.getMotorcycles().subscribe({
      next: (data: any) => this.motorcycles.set(data as MotorcycleItem[]),
      error: () => this.motorcycles.set([]),
    });
  };

  onSend(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      console.log('formulario invalido');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set('');

    this.httpAppointment.createAppointment(this.formData.value).subscribe({
      next: (res) => {
        console.log(res);
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.formData.reset();
      },
      error: (error: any) => {
        console.error(error);
        this.isSubmitting.set(false);
        this.submitError.set(
          (error?.error as any)?.msg ?? 'No se pudo registrar la cita. Intenta de nuevo.'
        );
      },
      complete: () => console.log('complete execute'),
    });
  }
}