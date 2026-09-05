import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpAppointments } from '../../../core/services/http-appointments';
import { HttpServices } from '../../../core/services/http-services';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { HttpAuth } from '../../../core/services/http-auth';
import { ServiceItem } from '../../../core/models/Service';
import { MotorcycleItem } from '../../../core/models/Motorcycle';
import { AlertService } from '../../../core/services/alert';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { QuickCreateButton } from '../../../shared/components/quick-create-button/quick-create-button';
import { faGear, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-appointment-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, BackButton, QuickCreateButton],
  templateUrl: './appointment-edit-form.html',
  styleUrl: './appointment-edit-form.css',
})
export default class AppointmentEditForm implements OnInit {
  faGear = faGear;
  faMotorcycle = faMotorcycle;
  private httpAppointment = inject(HttpAppointments);
  private httpServices = inject(HttpServices);
  private httpMotorcycles = inject(HttpMotorcycles);
  private httpAuth = inject(HttpAuth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);
  private alert = inject(AlertService);

  appointmentId!: string;
  services$ = new BehaviorSubject<ServiceItem[]>([]);
  motorcycles$ = new BehaviorSubject<MotorcycleItem[]>([]);

  canEditStatus = false;

  formData = this.fb.group({
    schedule: ['', Validators.required],
    service: ['', Validators.required],
    motorcycle: ['', Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id')!;

    const user = this.httpAuth.user;
    this.canEditStatus = user?.rol === 'owner' || user?.rol === 'admin';

    if (!this.canEditStatus) {
      this.formData.get('status')?.disable();
    }

    this.loadServices();
    this.loadMotorcycles();
    this.loadAppointment();
  }

  private loadAppointment() {
    this.httpAppointment.getAppointmentById(this.appointmentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.formData.patchValue({
            schedule: data.schedule,
            service: data.service._id,
            motorcycle: data.motorcycle._id,
            status: data.status,
          });
        },
        error: (error) => {
          console.error(error);
          this.alert.error('Error al cargar la cita', error.error?.msg || 'No se pudo obtener la información de la cita');
        },
      });
  }

  private loadServices() {
    this.httpServices.getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.services$.next(data),
        error: (error) => console.error(error),
      });
  }

  private loadMotorcycles() {
    this.httpMotorcycles.getMotorcycles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.motorcycles$.next(data),
        error: (error) => console.error(error),
      });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    // getRawValue() incluye también los campos deshabilitados (status, si el usuario no es admin/owner)
    this.httpAppointment.updateAppointment(this.appointmentId, this.formData.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alert.success('Cita actualizada', 'Los cambios se guardaron correctamente');
          this.router.navigate(['/dashboard/appointments']);
        },
        error: (error) => {
          console.error(error);
          this.alert.error('Error al guardar', error.error?.msg || 'No se pudo actualizar la cita');
        },
      });
  }
}
