import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { ReqAddExpense } from '../interfaces/expenses.interface';
import { AuthService } from '../../public/login/services/auth.service';
import { ExpenseService } from '../services/expense.service';
import Swal from 'sweetalert2';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es-cl');

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {


  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly expenseService: ExpenseService = inject(ExpenseService);
  private readonly fb: FormBuilder = inject(FormBuilder);
  public loading = signal(false);
  public today = signal(dayjs(new Date()).format('DD-MM-YYYY'));
  public minDate = signal(dayjs(new Date()).startOf('year').subtract(1, 'year').format('DD-MM-YYYY'));
  public userLogin = this.authService.user;

  constructor() {
  }


  public categories = signal([
    { value: 'comida', name: 'Comida' },
    { value: 'transporte', name: 'Transporte' },
    { value: 'hogar', name: 'Hogar' },
    { value: 'ocio', name: 'Ocio' },
    { value: 'salud', name: 'Salud' },
    { value: 'otros', name: 'Otros' },
  ])

  public addExpenseForm = this.fb.group({
    description: ['', []],
    category: ['', []],
    date: ['', []],
    amount: ['', []],
  });

  get formsValue() {
    return this.addExpenseForm.controls;
  }

 async onSubmit() {

    Swal.fire({
      title: 'Creando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const body: ReqAddExpense = {
      description: this.formsValue.description.value ?? '',
      category: this.formsValue.category.value ?? '',
      date: this.formsValue.date.value ?? '',
      amount: Number(this.formsValue.amount.value) ?? 0,
      user: this.userLogin()?.user._id ?? '',
    }
    this.expenseService.addExpense(body).subscribe({
      next: (res) => {
        if (res) {
          Swal.close();
          this.router.navigate(['/private/dashboard']);
        }
      },
      error: async (err) => {
        console.log('err', err);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.error.message}`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
    })
  }

}
