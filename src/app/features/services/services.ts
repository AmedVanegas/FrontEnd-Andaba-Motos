<<<<<<< HEAD
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Tipo simple solo para el frontend. Cuando conectes el backend,
// esto se reemplaza por el modelo real que devuelva la API.
interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-services',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  // Datos de ejemplo. Cuando conectes el backend, esto se llena
  // desde un servicio HTTP en vez de escribirse a mano aquí.
  services = signal<ServiceItem[]>([
    {
      id: 'svc-1',
      name: 'Cambio de aceite',
      description: 'Cambio de aceite y filtro con productos de alta calidad.',
      price: 80000,
    },
    {
      id: 'svc-2',
      name: 'Revisión general',
      description: 'Diagnóstico completo de frenos, luces, llantas y motor.',
      price: 60000,
    },
    {
      id: 'svc-3',
      name: 'Cambio de llantas',
      description: 'Montaje y balanceo de llantas nuevas o usadas.',
      price: 120000,
    },
    {
      id: 'svc-4',
      name: 'Ajuste de frenos',
      description: 'Revisión y ajuste del sistema de frenos delantero y trasero.',
      price: 45000,
    },
  ]);

  // Estado del panel de agendamiento
  selectedService = signal<ServiceItem | null>(null);
  submitSuccess = signal(false);

  appointmentForm = new FormGroup({
    client: new FormControl('', [Validators.required]),
    motorcycle: new FormControl('', [Validators.required]),
    schedule: new FormControl('', [Validators.required]),
  });

  openBooking(service: ServiceItem): void {
    this.selectedService.set(service);
    this.submitSuccess.set(false);
    this.appointmentForm.reset();
  }

  closeBooking(): void {
    this.selectedService.set(null);
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    // Por ahora no hay backend: solo mostramos el mensaje de éxito
    // y dejamos los datos en consola para que veas la forma del payload.
    console.log('Cita agendada (mock):', {
      ...this.appointmentForm.value,
      service: this.selectedService()?.id,
    });

    this.submitSuccess.set(true);
    this.appointmentForm.reset();
  }
}
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export default class Services {}
>>>>>>> 1534da5b0e706c65a98f3f9960cbcf7fc3e4e2dd
