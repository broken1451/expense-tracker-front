import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Expense, ExpenseResponse, ExpenseResponseCreated, ReqAddExpense, ReqUpdateExpense, ResponsePatchExpense } from '../interfaces/expenses.interface';
import { environment } from '../../../environments/environment';
import { delay, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private httpClient = inject(HttpClient);
  private _expenses = signal<Expense[] | null>([]);
  public expenses = computed(() => this._expenses());
  public Amounts = signal<number[]>([]);
  public totalAmount = computed(() => {
    return this.Amounts();
  })

  constructor() { }



  public getExpenses() {
    return this.httpClient.get<ExpenseResponse>(`${environment.apiUrl}/expenses`).pipe( 
      tap((res: ExpenseResponse) => {
        this._expenses.set(res.expenses);
      })
    );
  }


  public addExpense(body: ReqAddExpense) {
    return this.httpClient.post<ExpenseResponseCreated>(`${environment.apiUrl}/expenses`, body).pipe(
      delay(3000),
      tap((res: ExpenseResponseCreated) => {}),
      take(1)
    );
  }


  public findByLastWeek(){
    return this.httpClient.get<ExpenseResponse>(`${environment.apiUrl}/expenses/last/find-by-last-week`).pipe(
      tap((res: ExpenseResponse) => {
        this._expenses.set(res.expenses);
      })
    );
  }

  public findByLastMonth(){
    return this.httpClient.get<ExpenseResponse>(`${environment.apiUrl}/expenses/find/by-last-month`).pipe(
      tap((res: ExpenseResponse) => {
        this._expenses.set(res.expenses);
      })
    );
  }

  public findByLast3Months(){
    return this.httpClient.get<ExpenseResponse>(`${environment.apiUrl}/expenses/find/by-last-3month`).pipe(
      tap((res: ExpenseResponse) => {
        this._expenses.set(res.expenses);
      })
    );
  }


  public findByRangeDate(fecha_uno: string, fecha_dos: string){
    const params = new HttpParams().set('fecha_uno', fecha_uno).set('fecha_dos', fecha_dos);
    return this.httpClient.get<ExpenseResponse>(`${environment.apiUrl}/expenses/find/by-range-date`, {params}).pipe(
      tap((res: ExpenseResponse) => {
        this._expenses.set(res.expenses);
      })
    );
  }


  public deleteExpense(id: string){
    return this.httpClient.delete<ExpenseResponse>(`${environment.apiUrl}/expenses/${id}`).pipe(
      delay(3000),
      tap((res: ExpenseResponse) => {
        this._expenses.set(res.expenses);
      })
    );
  }

  public updateExpense(id: string, body: ReqUpdateExpense){
    return this.httpClient.patch<ResponsePatchExpense>(`${environment.apiUrl}/expenses/${id}`, body).pipe(
      delay(3000),
    );
  }

}
