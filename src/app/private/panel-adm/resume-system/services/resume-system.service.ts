import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, tap } from 'rxjs';
import { ResumenResponse } from '../interface/resume.interface';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeSystemService {

  private httpClient = inject(HttpClient);
  private _details = signal<ResumenResponse>({
    ok: false,
    bdSize: '',
    dbName: '',
  });
  public details = computed(() => this._details());

  constructor() { }

  public getDbDetails() {
    return this.httpClient.get<ResumenResponse>(`${environment.apiUrl}/auth/total/sizedb`).pipe(
      delay(3000),
      tap((res: ResumenResponse) => {
        this._details.set({
          ok: res.ok,
          bdSize: res.bdSize,
          dbName: res.dbName,
        });
      })
    );
  }
}
