import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, NgZone } from '@angular/core';
import { LoginReq, LoginResponse } from '../interfaces/login.interface';
import { environment } from '../../../../environments/environment';
import { catchError, delay, tap, throwError } from 'rxjs';
import { RegisterReq } from '../interfaces/register.interface';
import { ResponseUserCreated } from '../../register/interfaces/register.interface';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpClient = inject(HttpClient);
  private ngZone = inject(NgZone);
  public userLogin = signal<LoginResponse | null>(null);
  public loadingGoogle = signal<boolean>(false);

  public user = computed(() => this.userLogin());
  
  constructor() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userLogin.set(JSON.parse(user));
    }
    const token = localStorage.getItem('token');
    if (token) {
      this.userLogin.set(this.userLogin());
    }
  }
  
  public login(body: LoginReq) {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/auth/login`, body).pipe(
      delay(2000),
      tap((res: LoginResponse) => {
        this.userLogin.set(res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
      }),
      catchError((error) => {
        return throwError(() => {
          return new Error(error);
        });
      })
    );
  }

  public logout() {
    this.userLogin.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

    public register(body: RegisterReq) {
    return this.httpClient.post<ResponseUserCreated>(`${environment.apiUrl}/auth`, body).pipe(
      delay(4000),
      tap(( userNew: ResponseUserCreated) => {
        this.userLogin.set({
          ok: true,
          user: userNew.returnUserCreated,
          token: userNew.token
        });
        localStorage.setItem('token', userNew.token);
        localStorage.setItem('user', JSON.stringify({
          ok: true,
          user: userNew.returnUserCreated,
          token: userNew.token
        }));
      })
    );
  }

  public initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClient,
      callback: (response: any) => this.handleCredentialResponse(response)
    });
 
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }  // customization attributes
    );

    google.accounts.id.prompt(); // also display the One Tap dialog
  }

  public handleCredentialResponse(response: any) {
    // response.credential is the JWT token
    // console.log('Encoded JWT ID token: ' + response.credential);
    
    // You can decode the JWT token here or send it to your backend for verification
    // For demonstration, we'll just log it
    
    // If using NgZone, ensure any UI updates are run inside Angular's zone
    this.ngZone.run(() => {
       this.loadingGoogle.set(true);
       this.loginGoogle(response.credential, true).subscribe({
        next: (res) => {
          console.log('Login successful');
          this.loadingGoogle.set(true);
        },
        error: (err) => {
          console.error('Login failed', err);
        },
        complete: () => {
          this.loadingGoogle.set(false);
          console.log('Login process completed');
        }
       })
       // Update your application state here, e.g., store user info, navigate, etc.
     });
  }

  public loginGoogle(token: string, google: boolean = false) {
    return this.httpClient.post<any>(`${environment.apiUrl}/auth/login/google`, { token, google }).pipe(
      delay(4000),
      tap((userNew: ResponseUserCreated) => {
        if (userNew.exist) {
          this.userLogin.set({
            ok: true,
            user: userNew.user,
            token: userNew.token
          });
          localStorage.setItem('token', userNew.token);
          localStorage.setItem('user', JSON.stringify({
            ok: true,
            user: userNew.user,
            token: userNew.token
          }));
          return;
        }
        this.userLogin.set({
          ok: true,
          user: userNew.returnUserCreated,
          token: userNew.token
        });
        localStorage.setItem('token', userNew.token);
        localStorage.setItem('user', JSON.stringify({
          ok: true,
          user: userNew.returnUserCreated,
          token: userNew.token
        }));
      }),
      catchError((error) => {
        return throwError(() => {
          return new Error(error);
        });
      })
    );
  }
}
