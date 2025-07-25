import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./deudas.component').then(m => m.DeudasComponent)
  },
];
export default routes;