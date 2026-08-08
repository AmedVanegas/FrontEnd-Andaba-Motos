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
  {
    path: 'users/new',
    loadComponent: () => import('./features/users/user-form/user-form'),
  },
  {
    path: 'users/edit/:id',
    loadComponent: () => import('./features/users/user-form/user-form'),
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/products/product-form/product-form'),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./features/products/product-form/product-form'),
  },
  {
    path: 'motorcycles',
    loadComponent: () => import('./features/motorcycles/motorcycle-list/motorcycle-list'),
  },
  {
    path: 'motorcycles/new',
    loadComponent: () => import('./features/motorcycles/motorcycle-form/motorcycle-form'),
  },
  {
    path: 'motorcycles/edit/:id',
    loadComponent: () => import('./features/motorcycles/motorcycle-form/motorcycle-form'),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login'),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard'),
  },
  {
    path: 'appointment',
    loadComponent: () => import('./features/appointment/appointment-form/appointment-form'),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register'),
  },
  {
    path: 'categories/new',
    loadComponent: () => import('./features/categories/category-form/category-form'),
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./features/categories/category-form/category-form'),
  },
  {
    path:'checkout',
    loadComponent:()=>import('./features/checkout/checkout')

  },
  {
    path:'my-account',
    loadComponent:()=>import('./features/my-account/my-account')
  },
 


  //Redirecciones
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
