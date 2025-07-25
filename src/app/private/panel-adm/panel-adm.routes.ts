import { Routes } from '@angular/router';
import { authGuard } from '../../public/login/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./panel-adm.component').then(m => m.PanelAdmComponent),
    children: [
      {
        path: 'config-user',
        loadChildren: () => import('./config-user/config-user.routes'),
        canActivate: [authGuard],
      },
      {
        path: 'tdc',
        loadChildren: () => import('./tdc/tdc.routes'),
        canActivate: [authGuard],
      },
      {
        path: 'resume-system',
        loadChildren: () => import('./resume-system/resume-system.routes'), 
        canActivate: [authGuard],
      },
      {
        path: 'deudas',
        loadChildren: () => import('./deudas/deudas.routes'),
        canActivate: [authGuard],
      },
      {
        path: '**',
        redirectTo: 'resume-system',
      }
    ]
  },
];
export default routes;