import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login.component').then(m => m.LoginComponent)
  },
];
export default routes;