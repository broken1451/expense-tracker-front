import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tdc.component').then(m => m.TdcComponent),
  },
];
export default routes;