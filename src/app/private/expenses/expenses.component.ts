import { Component, ElementRef, inject, OnInit, signal, ViewChild, effect } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import dayjs from 'dayjs'
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Expense, ReqUpdateExpense } from '../interfaces/expenses.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { OrderByDatePipe } from '../pipes/orderByDate.pipe';
import { Router } from '@angular/router';
import { AuthService } from '../../public/login/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenses',
  imports: [ReactiveFormsModule, CurrencyPipe, CommonModule, OrderByPipe, OrderByDatePipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit {

  public readonly expenseService: ExpenseService = inject(ExpenseService);
  private readonly authService: AuthService = inject(AuthService);
  public readonly router: Router = inject(Router);
  public expenses = this.expenseService.expenses;
  public auxExpenses = signal<Expense[]>([]);
  public order = signal<string>('');
  public idExpense = signal<string>('');
  public fechaFilter = signal<string>('');
  public readonly fb: FormBuilder = inject(FormBuilder);
  public categories = signal([
    { value: 'comida', name: 'Comida' },
    { value: 'transporte', name: 'Transporte' },
    { value: 'hogar', name: 'Hogar' },
    { value: 'ocio', name: 'Ocio' },
    { value: 'salud', name: 'Salud' },
    { value: 'otros', name: 'Otros' },
  ]);

  public minDate = signal(dayjs().subtract(2, 'year').startOf('year').format('YYYY-MM-DD'));
  public tomorrow = signal(dayjs().add(0, 'day').format('YYYY-MM-DD'));

  public startDateNinDate = signal(dayjs().subtract(2, 'year').startOf('year').format('YYYY-MM-DD'));
  public tomorrowstartDate = signal(dayjs().add(0, 'day').format('YYYY-MM-DD'));

  public endDateminDate = signal(dayjs().subtract(2, 'year').startOf('year').format('YYYY-MM-DD'));
  public tomorrowEndDate = signal(dayjs().add(0, 'day').format('YYYY-MM-DD'));


  public expenseForm = this.fb.group({
    description: ['', []],
    orderBy: [''],
    fecha: [''],
    fechaStart: [''],
    fechaEnd: [''],
  });


  public expenseeEditForm = this.fb.group({
    description: ['', []],
    category: ['', []],
    amount: ['', []],
  });

  constructor() {
    effect(() => {
    }, { manualCleanup: true });
  }

  ngOnInit(): void {
    this.getExpenses();
  }


  public getExpenses() {
    this.expenseService.getExpenses().subscribe({
      next: (res) => {
        this.expenses()?.forEach((expense) => {
          expense.date = this.converDate(expense.date);
        })
        this.auxExpenses.set(Object.assign([], this.expenses()));
      },
      error: (err) => {
        console.error(err);
        this.authService.logout();
        this.router.navigate(['/public/login']);
      }
    });
  }

  onkeyPress($event: any): any {
    if (this.expenseForm?.controls?.description?.value?.trim()?.toLowerCase() === '') {
      this.expenseForm.controls.fechaStart.setValue("");
      this.expenseForm.controls.fechaEnd.setValue("");
      this.expenseForm.controls.fecha.setValue("");
      this.getExpenses();
    } else {
      this.expenseForm.controls.fechaStart.setValue("");
      this.expenseForm.controls.fechaEnd.setValue("");
      this.expenseForm.controls.fecha.setValue("");
      this.auxExpenses.set((this.expenses() || []).filter((ex) => {
        return ex?.description?.includes(this.expenseForm?.controls?.description?.value?.trim()?.toLowerCase()!);
      }));
    }
  }

  onCategoryChange($event: any) {
    this.order.set($event.target.value);
    this.fechaFilter.set("");
    this.expenseForm.controls.fecha.setValue("");
  }

  converDate(date: Date) {
    const dateFormat = dayjs(date).add(1, 'day').format('DD/MM/YYYY');
    return dateFormat;
  }

  onDateChange($event: any) {
    const date = this.converDate($event.target.value)
    this.fechaFilter.set(date);
    this.order.set("");
    this.expenseForm.controls.orderBy.setValue("");
  }


  onSubmit() {

  }

  findByLastWeek() {
    this.expenseService.findByLastWeek().subscribe({
      next: (res) => {
        this.expenses()?.forEach((expense) => {
          expense.date = this.converDate(expense.date);
        })
        this.auxExpenses.set(Object.assign([], this.expenses()));
      },
      error: (err) => {
        console.error(err);
        this.authService.logout();
        this.router.navigate(['/public/login']);
      }
    })
  }

  findByLastMonth() {
    this.expenseService.findByLastMonth().subscribe({
      next: (res) => {
        this.expenses()?.forEach((expense) => {
          expense.date = this.converDate(expense.date);
        })
        this.auxExpenses.set(Object.assign([], this.expenses()));
      },
      error: (err) => {
        console.error(err);
        this.authService.logout();
        this.router.navigate(['/public/login']);
      }
    })
  }

  findByLast3Months() {
    this.expenseService.findByLast3Months().subscribe({
      next: (res) => {
        this.expenses()?.forEach((expense) => {
          expense.date = this.converDate(expense.date);
        })
        this.auxExpenses.set(Object.assign([], this.expenses()));
      },
      error: (err) => {
        console.error(err);
        this.authService.logout();
        this.router.navigate(['/public/login']);
      }
    })
  }

  searchByRangeDate() {

    const startDate = dayjs(this.expenseForm.controls.fechaStart.value).add(1, 'day').format('YYYY-MM-DD');
    const fechaEnd = dayjs(this.expenseForm.controls.fechaEnd.value).add(1, 'day').format('YYYY-MM-DD');

    this.expenseService.findByRangeDate(startDate, fechaEnd).subscribe({
      next: (res) => {
        this.expenses()?.forEach((expense) => {
          expense.date = this.converDate(expense.date);
        })
        this.auxExpenses.set(Object.assign([], this.expenses()));
      },
      error: async (err) => {
        console.error(err);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Los rangos de fechas son obligatorios`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  deleteExpense(expense: Expense): any {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Borrará el gasto ' + expense.description,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'warning',
      confirmButtonText: '¡Sí!',
    }).then((borrar): any => {
      if (borrar.value) {
        Swal.fire({
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.expenseService.deleteExpense(expense._id).subscribe({
          next: (res) => {
            this.expenses()?.forEach((expense) => {
              expense.date = this.converDate(expense.date);
            });
            this.auxExpenses.set(Object.assign([], this.expenses()));
            this.getExpenses();
            Swal.close();
            Swal.fire(
              'Eliminado',
              'El gasto ' + expense.description + ' ha sido eliminado.',
              'success'
            );
          },
          error: async (err) => {
            console.error(err);
            Swal.close();
            await Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error al eliminar el gasto.',
              timer: 2000,
              showConfirmButton: false,
            });
          },
        });
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El gasto ' + expense.description + ' está a salvo :)',
          'info'
        );
      }
    });
  }

  editExpense(expense: Expense): void {
    this.idExpense.set(expense._id);
    this.expenseeEditForm.patchValue({
      description: expense.description,
      category: expense.category,
      amount: String(expense.amount),
    });
  }

  onSubmitEdit() {
    Swal.fire({
      title: 'Editando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const body: ReqUpdateExpense = {
      description: this.expenseeEditForm.controls.description.value!,
      category: this.expenseeEditForm.controls.category.value!,
      amount: Number(this.expenseeEditForm.controls.amount.value),
    }

    this.expenseService.updateExpense(this.idExpense(), body!).subscribe({
      next: async (res) => {
        this.expenses()?.forEach((expense) => {
          expense.date = this.converDate(expense.date);
        });
        this.auxExpenses.set(Object.assign([], this.expenses()));
        Swal.close();
        this.getExpenses();
        await  Swal.fire(
          'Editado',
          'El gasto ha sido editado.',
          'success'
        );
      },
      error: async (err) => {
        console.error(err);
        Swal.close();
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al editar el gasto.',
          timer: 2000,
          showConfirmButton: false,
        });
      },
    });
  }
}


