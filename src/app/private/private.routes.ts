import { Routes } from '@angular/router';
import { authGuard } from '../public/login/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./private.component').then(m => m.PrivateComponent),
    canActivate: [authGuard],
    children: [
        {
            path: 'dashboard',
            loadChildren: () => import('./dashboard/dashboard.routes'),
            canActivate: [authGuard],
        },
        {
            path: 'add-expense',
            loadChildren: () => import('./add-expense/add-expense.routes'),
            canActivate: [authGuard],
        },
        {
            path: 'expenses',
            loadChildren: () => import('./expenses/expenses.routes'),
            canActivate: [authGuard],
        },
        {
            path: 'panel-admin',
            loadChildren: () => import('./panel-adm/panel-adm.routes'),
            canActivate: [authGuard],
        },
        {
            path: '**',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }
    ]
  },
];
export default routes;