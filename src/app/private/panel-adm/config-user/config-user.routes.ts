import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./config-user.component').then(m => m.ConfigUserComponent),
  },
];
export default routes;