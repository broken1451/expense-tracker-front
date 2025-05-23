import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

export const GlobalInterceptor: HttpInterceptorFn = (req, next) => {

  let headers = req.headers;
  const router: Router = inject(Router);
  headers = headers.append('Access-Control-Allow-Origin', '*');
  headers = headers.append('Access-Control-Allow-Methods', 'POST,GET,DELETE,PATCH');
  headers = headers.append('Access-Control-Allow-Headers', 'Origin,X-Authorization-Type,X-System-Type');
  const token = localStorage.getItem('token')
  

  if (req.method === 'OPTIONS') {
    return next(req).pipe(
      map((event: any) => {
        return event;
      }),
      catchError((error: any) => {
        return throwError(() => {
          return error;
        });
      })
    );
  }

  console.log(`Intercept service: ${req?.url}, method: ${req?.method}`);

  req = req?.clone({
    headers
  });

  if (req?.url?.includes('/api/login') && req?.method === 'GET') {
    return next(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  req = req?.clone({
    headers,
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  if (req?.url?.includes('/api/expenses') && (req?.method === 'GET')) {
    return next(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }



  return next(req).pipe(
    map(event => {
      return event;
    }),
    catchError(error => {
      console.log({ error });
      if (error?.status === 401 || error?.status === 403) {
      //   this.globalService.token = '';
        sessionStorage?.clear();
        router.navigate(['/public/login']);
      }
      return throwError(error);
    })
  );
};
