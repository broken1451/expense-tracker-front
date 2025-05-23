import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./add-expense.component').then(m => m.AddExpenseComponent)
  },
];
export default routes;