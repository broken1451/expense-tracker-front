import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./expenses.component').then(m => m.ExpensesComponent)
  },
];
export default routes;