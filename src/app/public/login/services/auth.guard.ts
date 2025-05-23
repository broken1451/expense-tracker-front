import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {


  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);


  if (!authService.user()) {
    router.navigate(['/public/login']);
    localStorage.clear();
    sessionStorage.clear();
    return false;
  }

  return true;
};
