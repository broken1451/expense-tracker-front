import { Component, inject, OnInit, signal, effect, Renderer2 } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import dayjs from 'dayjs'
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Expense, ReqUpdateExpense } from '../interfaces/expenses.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { OrderByDatePipe } from '../pipes/orderByDate.pipe';
import { Router } from '@angular/router';
import { AuthService } from '../../public/login/services/auth.service';
import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Gasto {
  descripcion: string;
  categoria: string;
  fecha: string; // O Date
  monto: number;
}

@Component({
  selector: 'app-expenses',
  imports: [ReactiveFormsModule, CurrencyPipe, CommonModule, OrderByPipe, OrderByDatePipe],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit {

  public readonly expenseService: ExpenseService = inject(ExpenseService);
  public readonly renderer: Renderer2 = inject(Renderer2);
  private readonly authService: AuthService = inject(AuthService);
  public readonly router: Router = inject(Router);
  public readonly currencyPipe: CurrencyPipe = inject(CurrencyPipe);
  public readonly datePipe: DatePipe = inject(DatePipe);
  public expenses = this.expenseService.expenses;
  public auxExpenses = signal<Expense[]>([]);
  public order = signal<string>('');
  public idExpense = signal<string>('');
  public fechaFilter = signal<string>('');
  public readonly fb: FormBuilder = inject(FormBuilder);
  public categories = this.expenseService.categoriesCompunted();

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
        await Swal.fire(
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

  generateDetailedPdf() {
    const doc = new jsPDF();

    // --- 1. Encabezado del Informe ---
    doc.setFontSize(22);
    doc.text('Informe Administrativo de Gastos', 105, 20, { align: 'center' }); // Título centrado

    doc.setFontSize(10);
    doc.text(`Generado por: ${JSON.parse(localStorage.getItem('user')!).user.email}`, 10, 30);
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 10, 35);
    doc.text(`Período del Informe: ${dayjs().startOf('month').format('YYYY-MM-DD')} - ${dayjs().endOf('month').format('YYYY-MM-DD')}`, 10, 40);

    // Línea separadora
    doc.setDrawColor(0, 0, 0); // Color negro
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45); // Dibuja una línea horizontal (x1, y1, x2, y2)

    // --- 2. Resumen General de Gastos ---
    let totalGastos = this.auxExpenses().reduce((sum, gasto) => sum + gasto.amount, 0);
    let gastosPorCategoria: { [key: string]: number } = {};
    this.auxExpenses().forEach(gasto => {
      gastosPorCategoria[gasto.category] = (gastosPorCategoria[gasto.category] || 0) + gasto.amount;
    });

    doc.setFontSize(16);
    doc.text('Resumen General', 10, 55);
    doc.setFontSize(12);
    doc.text(`Total de Gastos: $${totalGastos.toLocaleString('es-CL')}`, 10, 65); // Formato de moneda chilena

    let yOffset = 75;
    doc.text('Gastos por Categoría:', 10, yOffset);
    yOffset += 10;
    for (const categoria in gastosPorCategoria) {
      doc.text(`- ${categoria}: $${gastosPorCategoria[categoria].toLocaleString('es-CL')}`, 20, yOffset);
      yOffset += 7;
    }

    // Otra línea separadora
    doc.line(10, yOffset + 5, 200, yOffset + 5);
    yOffset += 15;


    // --- 3. Detalle de la Lista de Gastos (Tabla detallada con jspdf-autotable) ---
    doc.setFontSize(16);
    doc.text('Detalle de Gastos Individuales', 10, yOffset);
    yOffset += 10;

    const tableColumns = ["Descripción", "Categoría", "Fecha", "Monto (CLP)"];
    const tableRows = this.auxExpenses().map(gasto => [
      gasto.description,
      gasto.category,
      gasto.date,
      `$${gasto.amount.toLocaleString('es-CL')}`
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: yOffset,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [52, 58, 64],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [51, 51, 51],
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 70 },
        3: { halign: 'right', cellWidth: 30 }
      },
      didDrawPage: (data: any) => {
        doc.setFontSize(10);
        const pageCount = doc.getNumberOfPages();
        doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // --- 4. Posibles Secciones Adicionales (Ejemplo) ---
    // Si quieres más detalles, como gastos por mes, o gráficos, tendrías que añadir lógica aquí.
    // Para gráficos, generarías una imagen (ej. con Chart.js en un canvas oculto, luego canvas.toDataURL())
    // y luego: doc.addImage(imgData, 'PNG', x, y, width, height);

    // --- 5. Guardar el PDF ---
    doc.save('informe_gastos_administrativo.pdf');
  }



}