import { Routes } from '@angular/router';
import { Home } from './features/home/home';



export const routes: Routes = [
  { path: 'home', component: Home }, //ruta carga automaticamente 

    // rutas cargan solo cuando se carga la url 

  {
    path: 'brochure',
    loadComponent: () => import('./features/brochure/brochure')
  },
  {
    path: 'about-us',
    loadComponent: () => import('./features/about-us/about-us')
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact'),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/page-not-found/page-not-found')
  },
  //Redirecciones
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
