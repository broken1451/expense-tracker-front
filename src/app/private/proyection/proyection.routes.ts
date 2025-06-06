import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./proyection.component').then(m => m.ProyectionComponent)
  },
];
export default routes;