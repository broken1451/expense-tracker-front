import { Routes } from '@angular/router';
import { authGuard } from './public/login/services/auth.guard';

export const routes: Routes = [
    {
        path: 'public',
        loadChildren: () => import('./public/public.routes'),
    },
    {
        path: 'private',
        loadChildren: () => import('./private/private.routes'),
        canActivate:[authGuard],
    },
    {
        path: '**',
        redirectTo: 'public',
        pathMatch: 'full'
    }
];
