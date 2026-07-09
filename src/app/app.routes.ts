import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', loadComponent: () => import('./features/about/about') .then( m => m.About )},
  { path: 'brochure', loadComponent: () => import('./features/brochure/brochure') .then( m => m.Brochure) },
  { path: '404', loadComponent: () => import('./features/page-not-found/page-not-found')},
  { path: 'appointment/list', loadComponent: () => import('./features/appointment-list/appointment-list') .then( m => m.AppointmentList )},
  {path: 'appointment-new-form', loadComponent: ()=> import('./features/appointment-new-form/appointment-new-form')},
  { path: 'services', loadComponent: () => import('./features/services/services').then( m => m.Services )},
  // Redirecciones
    {path:'', redirectTo: 'home', pathMatch: 'full'},
    {path: '++', redirectTo: '404', pathMatch: 'full'}
];
