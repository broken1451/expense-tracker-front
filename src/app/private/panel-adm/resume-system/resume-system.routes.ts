import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./resume-system.component').then(m => m.ResumeSystemComponent)
  },
];
export default routes;