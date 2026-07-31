import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpUsers } from '../../../core/services/http-users';
import { debounceTime, distinctUntilChanged, EMPTY, filter, switchMap } from 'rxjs';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { AlertService } from '../../../core/services/alert';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-motorcycle-form',
  imports: [ReactiveFormsModule],
  templateUrl: './motorcycle-form.html',
  styleUrl: './motorcycle-form.css',
})
export default class MotorcycleForm implements OnInit {
  private httpUsers = inject(HttpUsers);
  private httpMotorcycles = inject(HttpMotorcycles);
  private alert = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  formData: FormGroup;

  // Buscador de cliente: reemplaza el <select> que cargaba TODOS los
  // usuarios. Este control es independiente del formData -- solo maneja
  // el texto que se ve en el input; el id real que se envía al backend
  // vive en formData.get('client').
  clientSearchControl = new FormControl('');
  clientResults: any[] = [];
  searchingClient = false;
  showClientResults = false;

  isEditMode = false;
  formTitle: string = 'Registrar motocicleta';
  formButton: string = 'Crear motocicleta';
  motorcycleId: string | null = null;

  constructor() {
    this.formData = new FormGroup({
      licensePlate: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      brand: new FormControl('', [Validators.required]),
      modelName: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      client: new FormControl('', Validators.required),
      status: new FormControl(true, Validators.required),
    });
  }

  async onSubmit() {
    if (!this.formData.valid) {
      return;
    }

    const formValue = this.formData.value;

    if (this.isEditMode && this.motorcycleId) {
      // Confirmación antes de guardar los cambios (modo edición)
      const confirmed = await this.alert.confirmSave('la motocicleta', true);
      if (!confirmed) {
        return;
      }

      this.httpMotorcycles.editMotorcycle(this.motorcycleId, formValue).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          this.alert.error('No se pudo editar la motocicleta', error.error?.msg);
          console.log(error);
        },
        complete: () => {
          this.alert.success('Guardado!', 'Motocicleta actualizada');
          this.router.navigate(['/motorcycles']);
        },
      });
    } else {
      this.httpMotorcycles.createMotorcycle(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);
          this.formData.reset();
        },

        error: (error) => {
          this.alert.error('No se pudo crear la motocicleta', error.error?.msg);
          console.log(error);
        },

        complete: () => {
          console.log('complete execute');
          this.alert.success('Creada!', 'Motocicleta creada');
          this.router.navigate(['/motorcycles']);
        },
      });
    }
  }

  
  ngOnInit() {
    this.motorcycleId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.motorcycleId) {
      this.loadMotorcycle(this.motorcycleId);
      this.isEditMode = true;
      this.formTitle = 'Editar motocicleta';
      this.formButton = 'Editar';
    }

    this.clientSearchControl.valueChanges
      .pipe(
        filter((term): term is string => typeof term === 'string'),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const trimmed = term.trim();

          // si el término quedó muy corto (incluido vacío, al borrar todo)
          // limpiamos la lista en vez de dejarla con el último resultado
          if (trimmed.length < 2) {
            this.clientResults = [];
            this.showClientResults = false;
            this.searchingClient = false;
            this.cdr.markForCheck();
            return EMPTY;
          }

          this.searchingClient = true;
          return this.httpUsers.searchUsers(trimmed, 'client');
        }),
      )
      .subscribe((results) => {
        this.searchingClient = false;
        this.clientResults = results;
        this.showClientResults = true;
        this.cdr.markForCheck();
      });
  }

  selectClient(user: any) {
    this.formData.get('client')?.setValue(user._id);
    this.clientSearchControl.setValue(user.username, { emitEvent: false });
    this.clientResults = [];
    this.showClientResults = false;
  }

  onClientSearchFocus() {
    this.showClientResults = this.clientResults.length > 0;
  }

  onClientSearchBlur() {
    // pequeño delay: si no, el blur cierra la lista antes de que el click
    // en un resultado alcance a dispararse
    setTimeout(() => {
      this.showClientResults = false;
    }, 150);
  }

  loadMotorcycle(motorcycleId: string) {
    this.httpMotorcycles.getMotorcycleById(motorcycleId).subscribe({
      next: (data: any) => {
        const { motorcycle } = data;
        this.formData.patchValue(motorcycle);

        // motorcycle.client viene poblado ({_id, username}), no es el id
        // plano que espera el form -- se corrige aparte y se pinta el
        // nombre en el buscador
        if (motorcycle.client?._id) {
          this.formData.get('client')?.setValue(motorcycle.client._id);
          this.clientSearchControl.setValue(motorcycle.client.username, { emitEvent: false });
        }
        this.cdr.markForCheck();
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