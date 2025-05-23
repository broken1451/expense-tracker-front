import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public.component').then(m => m.PublicComponent),
    children: [
        {
            path: 'login',
            loadChildren: () => import('./login/login.routes')
        },
        {
            path: 'register',
            loadChildren: () => import('./register/register.routes')
        },
        {
            path: 'forgot-password',
            loadChildren: () => import('./forgot-pass/forgot-pass.routes')
        },
        {
            path: '**',
            redirectTo: 'login',
            pathMatch: 'full'
        }
    ]
  },
];
export default routes;