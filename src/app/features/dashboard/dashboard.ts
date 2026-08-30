import { Component, inject, MAX_ANIMATION_TIMEOUT } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpAuth } from '../../core/services/http-auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faBoxesStacked,
  faTags,
  faMotorcycle,
  faArrowRight,
  faChartLine,
  faClipboardList,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

interface DashboardSection {
  label: string;
  description: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, AsyncPipe, FontAwesomeModule, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard {
  httpAuth = inject(HttpAuth);
  faArrowRight = faArrowRight;
  routeChange = true

  mainRoute = '/dashboard'


  sections: DashboardSection[] = [
    {
      label: 'Usuarios',
      description: 'Clientes, empleados y cuentas del taller.',
      route: this.mainRoute +'/users',
      icon: faUsers,
    },
    {
      label: 'Productos',
      description: 'Catálogo de repuestos y accesorios en venta.',
      route: this.mainRoute +'/products',
      icon: faBoxesStacked,
    },
    {
      label: 'Categorías',
      description: 'Organiza el catálogo por tipo de producto.',
      route: this.mainRoute +'/categories',
      icon: faTags,
    },
    {
      label: 'Motocicletas',
      description: 'Motos registradas y su cliente asociado.',
      route: this.mainRoute +'/motorcycles',
      icon: faMotorcycle,
    },
    {
      label: 'Órdenes',
      description: 'Órdenes de compra de productos.',
      route: this.mainRoute +'/orders',
      icon: faClipboardList,
    },
    {
      label: 'Registros de servicio',
      description: 'Trabajos realizados en el taller.',
      route: this.mainRoute +'/service-records',
      icon: faWrench,
    },
    {
      label: 'Ventas y ganancias',
      description: 'Estado de ventas, ganancias y artículos vendidos.',
      route: this.mainRoute +'/reports',
      icon: faChartLine,
    },
  ];

  changeRoute(){
    this.routeChange = false
  }
}