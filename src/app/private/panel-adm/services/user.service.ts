import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { delay, take, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseCreatedUser, ResponseUpdateUser, UpdateReqUser, User, UserDeletedResponse, UserFormReq, UserResponse } from '../interfaces/user.interfaces';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpClient = inject(HttpClient);
  private _users = signal<User[] | null>([]);
  public users = computed(() => this._users());

  constructor() { }



  public getUsers() {
    return this.httpClient.get<UserResponse>(`${environment.apiUrl}/auth`).pipe( 
      tap((res: UserResponse) => {
        this._users.set(res.users.filter(user => user.isActive !== false));
      })
    );
  }


  public createUsers(body: UserFormReq) {
    return this.httpClient.post<ResponseCreatedUser>(`${environment.apiUrl}/auth`, body).pipe( 
      delay(3000),
      tap((res: ResponseCreatedUser) => {})
    );
  }


  public updateUser(id: string, body: UpdateReqUser) {
    return this.httpClient.patch<ResponseUpdateUser>(`${environment.apiUrl}/auth/${id}`, body).pipe( 
      delay(3000),
      tap((res: any) => {})
    );
  }

    public deleteUser(id: string){
      return this.httpClient.delete<UserDeletedResponse>(`${environment.apiUrl}/auth/${id}`).pipe(
        delay(3000),
        tap((res: UserDeletedResponse) => {})
      );
    }

  isFieldOneEqualToFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const formGroupTyped = formGroup as FormGroup;
      const pass1 = formGroupTyped.controls[field1].value;
      const pass2 = formGroupTyped.controls[field2].value;
  
      if (pass1 !== pass2) {
        formGroupTyped.controls[field2].setErrors({ noIguales: true });
        return { noIguales: true };
      }
  
      formGroupTyped.controls[field2].setErrors(null);
      return null;
    };
  }

  public isValidField(field: string, myForm: FormGroup) {
    return myForm.controls[field].errors && myForm.controls[field].touched;
  }

}
