import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpAuth } from '../../core/services/http-auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faBoxesStacked,
  faTags,
  faMotorcycle,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

interface DashboardSection {
  label: string;
  description: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, AsyncPipe, FontAwesomeModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard {
  httpAuth = inject(HttpAuth);

  faArrowRight = faArrowRight;

  // Agregar una sección nueva acá es lo único que hay que tocar
  // cuando se agregue otra lista de admin (citas, ordenes, etc.)
  sections: DashboardSection[] = [
    {
      label: 'Usuarios',
      description: 'Clientes, empleados y cuentas del taller.',
      route: '/users',
      icon: faUsers,
    },
    {
      label: 'Productos',
      description: 'Catálogo de repuestos y accesorios en venta.',
      route: '/products',
      icon: faBoxesStacked,
    },
    {
      label: 'Categorías',
      description: 'Organiza el catálogo por tipo de producto.',
      route: '/categories',
      icon: faTags,
    },
    {
      label: 'Motocicletas',
      description: 'Motos registradas y su cliente asociado.',
      route: '/motorcycles',
      icon: faMotorcycle,
    },
  ];
}