import { Routes } from '@angular/router';
import { Home } from './features/home/home';
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
  //Redirecciones
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
