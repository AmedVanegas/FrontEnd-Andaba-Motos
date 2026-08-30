import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, debounceTime, distinctUntilChanged, EMPTY, filter, switchMap } from 'rxjs';

import { HttpServiceRecord } from '../../../core/services/http-service-record';
import { HttpAppointments } from '../../../core/services/http-appointments';
import { HttpUsers } from '../../../core/services/http-users';
import { HttpProducts } from '../../../core/services/http-products';
import { AlertService } from '../../../core/services/alert';
import { BackButton } from '../../../shared/components/back-button/back-button';

@Component({
  selector: 'app-service-record-form',
  imports: [ReactiveFormsModule, AsyncPipe, BackButton],
  templateUrl: './service-record-form.html',
  styleUrl: './service-record-form.css',
})
export default class ServiceRecordForm implements OnInit {
  private httpRecord = inject(HttpServiceRecord);
  private httpAppointment = inject(HttpAppointments);
  private httpUsers = inject(HttpUsers);
  private httpProducts = inject(HttpProducts);
  private alert = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  appointmentList$ = new BehaviorSubject<any[]>([]);
  productList$ = new BehaviorSubject<any[]>([]);

  mechanicSearchControl = new FormControl('');
  mechanicResults: any[] = [];
  showMechanicResults = false;

  isEditMode = false;
  formTitle = 'Registrar servicio';
  formButton = 'Crear registro';
  recordId: string | null = null;

  existingAppointmentLabel = '';
  existingProducts: any[] = [];

  formData: FormGroup;

  constructor() {
  
    this.formData = new FormGroup({
      appointment: new FormControl('', Validators.required),
      description: new FormControl(''),
      observations: new FormControl(''),
      usedProducts: new FormArray([this.createProductGroup()]),
      finalCost: new FormControl(null, [Validators.required, Validators.min(0)]),
      mechanic: new FormControl(''), 
    });
  }

  get usedProducts(): FormArray {
    return this.formData.get('usedProducts') as FormArray;
  }

  private createProductGroup(): FormGroup {
    return new FormGroup({
      product: new FormControl('', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit() {
    this.loadAppointments();
    this.loadProducts();

    this.recordId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.recordId) {
      this.isEditMode = true;
      this.formTitle = 'Editar registro de servicio';
      this.formButton = 'Guardar cambios';
      this.loadRecord(this.recordId);
    }

    this.mechanicSearchControl.valueChanges
      .pipe(
        filter((term): term is string => typeof term === 'string'),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term.trim();
          if (trimmed.length < 2) {
            this.mechanicResults = [];
            this.showMechanicResults = false;
            this.cdr.markForCheck();
            return EMPTY;
          }
          return this.httpUsers.searchUsers(trimmed);
        }),
      )
      .subscribe((results) => {
        this.mechanicResults = results;
        this.showMechanicResults = true;
        this.cdr.markForCheck();
      });
  }

  selectMechanic(user: any) {
    this.formData.get('mechanic')?.setValue(user._id);
    this.mechanicSearchControl.setValue(user.username, { emitEvent: false });
    this.mechanicResults = [];
    this.showMechanicResults = false;
  }

  onMechanicSearchFocus() {
    this.showMechanicResults = this.mechanicResults.length > 0;
  }

  onMechanicSearchBlur() {
    setTimeout(() => {
      this.showMechanicResults = false;
    }, 150);
  }

  loadAppointments() {
    this.httpAppointment.getAppointments().subscribe({
      next: (res) => {
        const items = Array.isArray(res?.data) ? res.data : [];
        this.appointmentList$.next(items);
      },
      error: (error) => {
        console.error(error);
        this.appointmentList$.next([]);
      },
    });
  }

  loadProducts() {
    this.httpProducts.getProducts().subscribe({
      next: (data) => this.productList$.next(data),
      error: (error) => console.log(error),
    });
  }

  loadRecord(id: string) {
    this.httpRecord.getServiceRecordById(id).subscribe({
      next: (res: any) => {
        const record = res.data ?? res;

        this.formData.patchValue({
          description: record.description ?? '',
          observations: record.observations ?? '',
          finalCost: record.finalCost ?? 0,
        });

        this.existingAppointmentLabel = record.appointment?.client?.username
          ? `${record.appointment.client.username} — ${record.appointment.status ?? ''}`
          : (record.appointment ?? 'Cita no disponible');

        this.existingProducts = record.usedProducts ?? [];

        if (record.mechanic?._id) {
          this.formData.get('mechanic')?.setValue(record.mechanic._id);
          this.mechanicSearchControl.setValue(record.mechanic.username, { emitEvent: false });
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
        this.alert.error('No se pudo cargar el registro', error.error?.msg);
      },
    });
  }

  addProduct() {
    this.usedProducts.push(this.createProductGroup());
  }

  removeProduct(index: number) {
    this.usedProducts.removeAt(index);
  }

  async onSubmit() {
    if (this.isEditMode && this.recordId) {
      const confirmed = await this.alert.confirmSave('el registro de servicio', true);
      if (!confirmed) return;

 
      const payload: any = {
        description: this.formData.get('description')?.value,
        observations: this.formData.get('observations')?.value,
        finalCost: this.formData.get('finalCost')?.value,
      };
      const mechanic = this.formData.get('mechanic')?.value;
      if (mechanic) {
        payload.mechanic = mechanic;
      }

      this.httpRecord.updateServiceRecord(this.recordId, payload).subscribe({
        next: (res) => console.log(res),
        error: (error) => {
          console.log(error);
          this.alert.error('No se pudo actualizar el registro', error.error?.msg);
        },
        complete: () => {
          this.alert.success('Guardado!', 'Registro actualizado');
          this.router.navigateByUrl('/dashboard/service-records');
        },
      });
      return;
    }

    if (this.formData.get('appointment')?.invalid || this.usedProducts.invalid || this.formData.get('finalCost')?.invalid) {
      this.formData.get('appointment')?.markAsTouched();
      this.formData.get('finalCost')?.markAsTouched();
      this.usedProducts.markAllAsTouched();
      return;
    }

    const payload = {
      appointment: this.formData.get('appointment')?.value,
      description: this.formData.get('description')?.value,
      observations: this.formData.get('observations')?.value,
      usedProducts: this.usedProducts.value.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      finalCost: this.formData.get('finalCost')?.value,
    };

    this.httpRecord.createServiceRecord(payload).subscribe({
      next: (res) => console.log(res),
      error: (error) => {
        console.log(error);
        if (error.status === 409) {
          this.alert.error('Stock insuficiente', 'No hay stock suficiente para completar el registro');
        } else {
          this.alert.error('No se pudo crear el registro', error.error?.msg);
        }
      },
      complete: () => {
        this.alert.success('Creado!', 'Registro de servicio creado');
        this.router.navigateByUrl('/dashboard/service-records');
      },
    });
  }

  get appointment() {
    return this.formData.get('appointment');
  }

  get finalCost() {
    return this.formData.get('finalCost');
  }
}
