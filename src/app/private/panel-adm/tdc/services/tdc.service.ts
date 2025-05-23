import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateTDCReq, CreditCard, ResponseDeletedTdc, TDCInterface, Transaction, UpdateTDCReq } from '../interfaces/tdc.interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { delay, tap } from 'rxjs';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root' 
})
export class TdcService {

  private httpClient = inject(HttpClient);
  private _creditCards = signal<CreditCard[] | null>([]);
  public creditCards = computed(() => this._creditCards());

  constructor() { }

  public getCreditCards() {
    return this.httpClient.get<TDCInterface>(`${environment.apiUrl}/credit-cards`).pipe(
      tap((res: TDCInterface) => {
        this._creditCards.set(res.creditCards);
      })
    );
  }

  public createCreditCard(body: CreateTDCReq) {
    return this.httpClient.post(`${environment.apiUrl}/credit-cards`, body).pipe(
      tap((res: any) => {
        this._creditCards.update((prev) => [...prev!, res]);
      })
    );
  }

  public updateCreditCard(id: string, body: UpdateTDCReq) {
    return this.httpClient.patch<any>(`${environment.apiUrl}/credit-cards/${id}`, body).pipe(
      delay(3000),
      tap((res: any) => { })
    );
  }

  public deleteCreditCard(id: string) {
    return this.httpClient.delete<ResponseDeletedTdc>(`${environment.apiUrl}/credit-cards/${id}`).pipe(
      delay(3000),
      tap((res: any) => {

      })
    );
  }

  converDate(date: Date): any {
    const dateFormat = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
    return dateFormat;
  }

  public createTransactionByCard(body: Transaction) {
    return this.httpClient.patch<any>(`${environment.apiUrl}/credit-cards/update/transaction/${body.tarjeta}`, body).pipe(
      delay(3000),
      tap((res: any) => { 
        this._creditCards.update((prev) => [...prev!, res]);
      })
    );
  }

  public deleteTransactionByCard(nameCreditCard: string, transactionId: string){
    return this.httpClient.delete<any>(`${environment.apiUrl}/credit-cards/delete/transaction/${nameCreditCard}/${transactionId}`).pipe(
      delay(3000),
      tap((res: any) => {})
    );
  }
}