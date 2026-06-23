import { Routes } from '@angular/router';
import { Home } from './app/features/home/home';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', loadComponent: () => import('./app/features/about/about') .then( m => m.About )},
  { path: 'brochure', loadComponent: () => import('./app/features/brochure/brochure') .then( m => m.Brochure) },
  { path: '404', loadComponent: () => import('./app/features/page-not-found/page-not-found')},
  // Redirecciones
    {path:'', redirectTo: 'home', pathMatch: 'full'},
    {path: '++', redirectTo: '404', pathMatch: 'full'}
];
