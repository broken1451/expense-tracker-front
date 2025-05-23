import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./register.component').then(m => m.RegisterComponent)
  },
];
export default routes;