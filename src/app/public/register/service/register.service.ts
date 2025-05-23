import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RecoverPassReq, RegisterReq } from '../../login/interfaces/register.interface';
import { delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private httpClient = inject(HttpClient);

  constructor() { }


  public register(body: RegisterReq) {
    return this.httpClient.post<any>(`${environment.apiUrl}/auth`, body).pipe(
      delay(4000),
      tap(userNew => {})
    );
  }
  
  
  public recoverPass(body: RecoverPassReq) {
    return this.httpClient.post<any>(`${environment.apiUrl}/auth/recover-password`, body).pipe(
      delay(4000),
      tap(passRecovered => {})
    );
  }






}
