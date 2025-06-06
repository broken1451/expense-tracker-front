import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RecoverPassReq, RegisterReq } from '../../login/interfaces/register.interface';
import { delay, tap } from 'rxjs';
import { ResponseUserCreated } from '../interfaces/register.interface';
import { AuthService } from '../../login/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private httpClient = inject(HttpClient);
  public userLogin = signal<ResponseUserCreated | null>(null);
  public user = computed(() => this.userLogin());
  public authService: AuthService = inject(AuthService);

  constructor() {
    
  }
  
  public recoverPass(body: RecoverPassReq) {
    return this.httpClient.post<any>(`${environment.apiUrl}/auth/recover-password`, body).pipe(
      delay(4000),
      tap(passRecovered => {})
    );
  }






}
