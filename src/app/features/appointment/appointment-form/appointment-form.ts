import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpAppointments } from '../../../core/services/http-appointments';
import { HttpUsers } from '../../../core/services/http-users';
import { HttpServices } from '../../../core/services/http-services';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { AlertService } from '../../../core/services/alert';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { QuickCreateButton } from '../../../shared/components/quick-create-button/quick-create-button';
import { faUsers, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule, BackButton, QuickCreateButton],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export default class AppointmentForm implements OnInit {
  faUsers = faUsers;
  faMotorcycle = faMotorcycle;
  private httpAppointment = inject(HttpAppointments);
  private httpUsers = inject(HttpUsers);
  private httpServices = inject(HttpServices);
  private httpMotorcycles = inject(HttpMotorcycles);
  private alert = inject(AlertService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  // Datos completos cargados del backend
  allUsers = signal<any[]>([]);
  allServices = signal<any[]>([]);
  clientMotorcycles = signal<any[]>([]);

  // Texto que el usuario escribe en cada buscador
  clientSearch = signal('');
  motorcycleSearch = signal('');
  serviceSearch = signal('');

  // Qué lista desplegable está abierta ahora mismo
  openDropdown = signal<'client' | 'motorcycle' | 'service' | null>(null);

  // Coincidencias filtradas en vivo
  filteredClients = computed(() => {
    const term = this.clientSearch().toLowerCase().trim();
    if (!term) return this.allUsers();
    return this.allUsers().filter((u) =>
      u.username?.toLowerCase().includes(term)
    );
  });

  filteredMotorcycles = computed(() => {
    const term = this.motorcycleSearch().toLowerCase().trim();
    if (!term) return this.clientMotorcycles();
    return this.clientMotorcycles().filter((m) =>
      `${m.brand} ${m.modelName} ${m.licensePlate}`.toLowerCase().includes(term)
    );
  });

  filteredServices = computed(() => {
    const term = this.serviceSearch().toLowerCase().trim();
    if (!term) return this.allServices();
    return this.allServices().filter((s) =>
      s.name?.toLowerCase().includes(term)
    );
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  formData = new FormGroup({
    client: new FormControl('', [Validators.required]),
    motorcycle: new FormControl('', [Validators.required]),
    service: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
    status: new FormControl('confirmada'),
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadServices();
    this.preselectServiceFromQueryParam();
  }

  goBack(): void {
    this.location.back();
  }

  private loadUsers(): void {
    this.httpUsers.getUsers().subscribe({
      next: (data) => this.allUsers.set(data),
      error: (err) => console.error(err),
    });
  }

  private loadServices(): void {
    this.httpServices.getServices().subscribe({
      next: (data) => this.allServices.set(data),
      error: (err) => console.error(err),
    });
  }

  private preselectServiceFromQueryParam(): void {
    const serviceId = this.route.snapshot.queryParamMap.get('serviceId');
    if (!serviceId) return;

    // Espera a que los servicios carguen para poder mostrar el nombre en el input
    const check = setInterval(() => {
      const service = this.allServices().find((s) => s._id === serviceId);
      if (service) {
        this.selectService(service);
        clearInterval(check);
      }
    }, 100);
  }

  // ===== Cliente =====
  onClientInputChange(value: string): void {
    this.clientSearch.set(value);
    this.openDropdown.set('client');
    this.formData.get('client')?.setValue('');
  }

  selectClient(user: any): void {
    this.formData.get('client')?.setValue(user._id);
    this.clientSearch.set(user.username);
    this.openDropdown.set(null);

    // Resetea moto seleccionada y trae las motos de este cliente
    this.formData.get('motorcycle')?.setValue('');
    this.motorcycleSearch.set('');
    this.clientMotorcycles.set([]);

    this.httpMotorcycles.getMotorcycleByUserId(user._id).subscribe({
      next: (value: any) => this.clientMotorcycles.set(value.motorcycles),
      error: (err) => console.error(err),
    });
  }

  // ===== Moto =====
  onMotorcycleInputChange(value: string): void {
    this.motorcycleSearch.set(value);
    this.openDropdown.set('motorcycle');
    this.formData.get('motorcycle')?.setValue('');
  }

  selectMotorcycle(moto: any): void {
    this.formData.get('motorcycle')?.setValue(moto._id);
    this.motorcycleSearch.set(`${moto.brand} ${moto.modelName} — ${moto.licensePlate}`);
    this.openDropdown.set(null);
  }

  // ===== Servicio =====
  onServiceInputChange(value: string): void {
    this.serviceSearch.set(value);
    this.openDropdown.set('service');
    this.formData.get('service')?.setValue('');
  }

  selectService(service: any): void {
    this.formData.get('service')?.setValue(service._id);
    this.serviceSearch.set(service.name);
    this.openDropdown.set(null);
  }

  closeDropdowns(): void {
    // Pequeño delay para que el click en una opción se registre antes de cerrar
    setTimeout(() => this.openDropdown.set(null), 150);
  }

  onSend(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.httpAppointment.createAppointment(this.formData.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
      },
      error: (error: any) => {
        this.isSubmitting.set(false);
        this.alert.error('Error al crear la cita', error.error?.msg);
      },
    });
  }
}
