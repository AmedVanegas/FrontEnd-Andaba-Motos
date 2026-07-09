import { Routes } from '@angular/router';
import { Home } from './features/home/home';
<<<<<<< HEAD

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
=======
import Services from './features/services/services';

export const routes: Routes = [
  { path: 'home', component: Home }, //ruta carga automaticamente

  // rutas cargan solo cuando se carga la url

  {
    path: 'brochure',
    loadComponent: () => import('./features/brochure/brochure'),
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/user-list/user-list'),
  },

  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list'),
  },

  {
    path: 'about-us',
    loadComponent: () => import('./features/about-us/about-us'),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact'),
  },
  {
    path: '404',
    loadComponent: () => import('./features/page-not-found/page-not-found'),
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services'),
  },
  {
    path:'new-user-form',
    loadComponent: () => import('./features/users/new-user-form/new-user-form'),


  },
  //Redirecciones
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
>>>>>>> 1534da5b0e706c65a98f3f9960cbcf7fc3e4e2dd
];
