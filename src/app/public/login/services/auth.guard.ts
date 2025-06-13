import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { RegisterService } from '../../register/service/register.service';

export const authGuard: CanActivateFn = (route, state) => {


  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const registerService: RegisterService = inject(RegisterService);

  if (!authService.user()) {
    console.warn('User is not authenticated, redirecting to login page.');
    router.navigate(['/public/login']);
    localStorage.clear();
    sessionStorage.clear();
    return false;
  }

  return true;
};
