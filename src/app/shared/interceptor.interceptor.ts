import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import Swal from 'sweetalert2';

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
        return throwError( () => {
          return new Error(error);
        });
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
        return throwError(() => {  
          return new Error(error);
        });
      })
    );
  }

  return next(req).pipe(
    map(event => {
      return event;
    }),
    catchError( (error) => {
      console.log({ error: error});
      if (error.error.statusCode === 401 || error.error.statusCode === 403) {        
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `no tienes permisos para acceder a este recurso`,
          timer: 2000,
          showConfirmButton: false,
        });      
        router.navigate(['/public/dashboard']);  
      }

      if (error.error.statusCode === 400) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.error.message}`,
          timer: 2000,
          showConfirmButton: false,
        });    
        return throwError(() => {
          return new Error(error);
        });
      }
      return throwError(() =>{
        console.error('Error in interceptor:', error);
        return new Error(error);
      });
    })
  );
};
