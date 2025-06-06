import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginReq, LoginResponse } from '../interfaces/login.interface';
import { environment } from '../../../../environments/environment';
import { delay, tap } from 'rxjs';
import { RegisterReq } from '../interfaces/register.interface';
import { ResponseUserCreated } from '../../register/interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private httpClient = inject(HttpClient);
  public userLogin = signal<LoginResponse | null>(null);

  public user = computed(() => this.userLogin());
  
  constructor() {
    console.log('AuthService initialized');
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
}
