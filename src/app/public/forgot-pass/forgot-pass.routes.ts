import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./forgot-pass.component').then(m => m.ForgotPassComponent)
  },
];
export default routes;