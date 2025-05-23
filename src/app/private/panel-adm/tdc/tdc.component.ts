import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TdcService } from './services/tdc.service';
import dayjs from 'dayjs'
import { CreateTDCReq, CreditCard, ResponseDeletedTdc, Transaction, UpdateTDCReq } from './interfaces/tdc.interfaces';
import { FormatDatePipe } from '../../pipes/formatDate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tdc',
  imports: [CommonModule, ReactiveFormsModule, FormatDatePipe],
  templateUrl: './tdc.component.html',
  styleUrl: './tdc.component.scss'
})
export class TdcComponent implements OnInit {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly tdcService: TdcService = inject(TdcService);
  private readonly formatPipe: FormatDatePipe = new FormatDatePipe();
  public creditCards = this.tdcService.creditCards;
  public creditCardsTransactions = signal<Transaction[]>([]);
  public montoTotal = signal<number>(0);
  public nroCuota = signal<number>(0);
  public _idCreditCard = signal<string>('');
  public _idTransaction = signal<string>('');
  public interesCompra = signal<number>(0);
  public minDate = signal(dayjs().subtract(3, 'year').month(0).startOf('month').format('YYYY-MM-DD'));
  public minDatePaid = signal(dayjs().format('YYYY-MM-DD'));
  public minDateClosing = signal(dayjs().add(5, 'year').month(11).endOf('month').format('YYYY-MM-DD'));

  public states = signal<string[]>(['PENDING', 'PAID', 'CANCELED']);
  public pendingIntallments = signal<number[]>([]);
  public paid = signal<number[]>([]);


  public tdcEditForm = this.fb.group({
    name: ['', []],
    creditLimit: ['', []],
    annualInterestRate: ['', []],
    grantDate: ['', []], // "fecha de otorgamiento" in English
    dueDate: ['', []],
  });

  public createTDCform = this.fb.group({
    name: ['', []],
    creditLimit: ['', []],
    annualInterestRate: ['', []],
    grantDate: ['', []], // "fecha de otorgamiento" in English
    dueDate: ['', []],
  });

  public gestionTdcForm = this.fb.group({
    tarjeta: ['', []],
    description: ['', []],
    totalAmount: ['', []],
    dayBuy: ['', []],
    nextPayment: ['', []],
    installments: ['', []],
    interestPurchase: ['', []],
    installmentAmount: [{ value: '', disabled: true }, []],
    totalInterestPerInstallment: [{ value: '', disabled: true }, []],
  });

  public gestionTrasactionForm = this.fb.group({
    dayBuy: ['', []],
    description: ['', []],
    tarjeta: ['', []],
    totalAmount: ['', []],
    interestPurchase: ['', []],
    installments: ['', []],
    installmentAmount: [{ value: '', disabled: true }, []],
    totalInterestPerInstallment: [{ value: '', disabled: true }, []],
    nextPayment: ['', []],
    state: ['', []],
    pending: [{ value: 0, disabled: true }, []],
    paid: [0, []],
  });

  constructor() {
    effect(() => {
      this.creditCards();
    })

  }

  ngOnInit(): void {
    this.getCreditCard();
  }

  calevent(event: any) {
    this.montoTotal.set(event.target.value);
    this.calcularMontoCuota();
  }

  calcularCuota(event: any) {
    this.nroCuota.set(Number(event.target.value));
    this.calcularMontoCuota();
  }

  calInteres(event: any) {
    this.interesCompra.set(event.target.value);
    this.calcularInteresTotal()
  }


  calcularMontoCuota() {
    const nroCuota = this.nroCuota();
    const montoTotal = this.montoTotal();
    this.gestionTdcForm.patchValue({
      installmentAmount: (montoTotal / nroCuota).toFixed(2),
    })
  }

  calcularInteresTotal() {
    const montoTotal = this.montoTotal();
    const interesCompra = this.interesCompra();
    this.gestionTdcForm.patchValue({
      totalInterestPerInstallment: (montoTotal * (interesCompra / 100)).toFixed(2),
    });
  }

  getCreditCard() {
    this.tdcService.getCreditCards().subscribe({
      next: () => {
        this.creditCards()?.forEach((card) => {
          card.dueDate = this.converDate(card.dueDate);
          card.grantDate = this.converDate(card.grantDate);
          this.creditCardsTransactions.update((prev) => {
            return [...prev, ...card.transaction];
          });
        });
        const uniqueTransactions = this.creditCardsTransactions().filter((transaction, index, self) => {
          transaction.dayBuy = this.converDate(transaction.dayBuy);
          transaction.nextPayment = this.converDate(transaction.nextPayment);
          return index === self.findIndex(t => t._id === transaction._id)
        });
        this.creditCardsTransactions.set(uniqueTransactions);
      }
    })
  }

  converDate(date: Date): any {
    const dateFormat = dayjs(date).add(1, 'day').format('YYYY-MM-DD');
    return dateFormat;
  }

  createTDC() {

    if (!this.createTDCform.valid) {
      return;
    }

    const body: CreateTDCReq = {
      name: this.createTDCform.get('name')?.value!,
      creditLimit: Number(this.createTDCform.get('creditLimit')?.value!),
      annualInterestRate: Number(this.createTDCform.get('annualInterestRate')?.value!),
      dueDate: new Date(this.createTDCform.get('dueDate')?.value!),
      grantDate: new Date(this.createTDCform.get('grantDate')?.value!),
      user: JSON.parse(localStorage.getItem('user')!).user._id,
    }

    this.tdcService.createCreditCard(body).subscribe({
      next: (res) => {
        this.getCreditCard();
      },
      error: (err) => {
        console.log('err', err);
      },
      complete: () => {
        this.createTDCform.reset();
      }
    })
  }

  editTDC(tdc: CreditCard) {
    this._idCreditCard.set(tdc._id);
    this.tdcEditForm.patchValue({
      name: tdc.name,
      creditLimit: tdc.creditLimit.toString(),
      annualInterestRate: tdc.annualInterestRate.toString(),
      dueDate: this.formatPipe.transform(tdc.dueDate, 'YYYY-MM-DD'),
      grantDate: this.formatPipe.transform(tdc.grantDate, 'YYYY-MM-DD'),
    });
  }


  editTDCSubmit() {

    if (!this.tdcEditForm.valid) {
      return;
    }

    Swal.fire({
      title: 'Editando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const body: UpdateTDCReq = {
      name: this.tdcEditForm.get('name')?.value!,
      creditLimit: Number(this.tdcEditForm.get('creditLimit')?.value!),
      annualInterestRate: Number(this.tdcEditForm.get('annualInterestRate')?.value!),
      dueDate: new Date(this.tdcEditForm.get('dueDate')?.value!),
      grantDate: new Date(this.tdcEditForm.get('grantDate')?.value!),
      user: JSON.parse(localStorage.getItem('user')!).user._id,
    }

    this.tdcService.updateCreditCard(this._idCreditCard(), body).subscribe({
      next: (res) => {
        console.log('res', res);
        this.getCreditCard();
        Swal.close();
      },
      error: (err) => {
        console.log('err', err);
      }
    })
  }


  deleteTdc(tdc: CreditCard): any {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Borrará la tarjeta ' + tdc.name,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'warning',
      confirmButtonText: '¡Sí!',
    }).then((result): any => {
      if (result.value) {
        Swal.fire({
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.tdcService.deleteCreditCard(tdc._id).subscribe({
          next: (res: ResponseDeletedTdc) => {
            this.getCreditCard();
            Swal.close();
            Swal.fire(
              'Eliminado',
              'La tarjeta ' + tdc.name + ' ha sido eliminada.',
              'success'
            );
          },
          error: async (err) => {
            console.error(err);
            Swal.close();
            await Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error al eliminar la TDC.',
              timer: 2000,
              showConfirmButton: false,
            });
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'La tarjeta ' + tdc.name + ' está a salvo :)',
          'info'
        );
      }
    });
  }

  createTransaction() {
    const body: Transaction = {
      tarjeta: (this.gestionTdcForm.get('tarjeta')?.value!),
      description: this.gestionTdcForm.get('description')?.value!,
      totalAmount: Number(this.gestionTdcForm.get('totalAmount')?.value!),
      dayBuy: new Date(this.gestionTdcForm.get('dayBuy')?.value!),
      installments: Number(this.gestionTdcForm.get('installments')?.value!),
      interestPurchase: Number(this.gestionTdcForm.get('interestPurchase')?.value!),
      installmentAmount: Number(this.gestionTdcForm.get('installmentAmount')?.value!),
      totalInterestPerInstallment: Number(this.gestionTdcForm.get('totalInterestPerInstallment')?.value!),
      nextPayment: new Date(this.gestionTdcForm.get('nextPayment')?.value!),
      state: {
        state: 'PENDING',
        pending: Number(this.gestionTdcForm.get('installments')?.value!),
        paid: 0
      },
    }
    Swal.fire({
      title: 'Creando Transaccion...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.tdcService.createTransactionByCard(body).subscribe({
      next: (res) => {
        this.getCreditCard();
         Swal.close();
         this.gestionTdcForm.reset();
      },
      error: (err) => {
        console.log('err', err);
      },
    })
  }

  updateTransaction(item: Transaction) {
    this.pendingIntallments.set(Array.from({ length: item.state.pending }, (_, i) => i + 1))
    this.paid.set(Array.from({ length: item.state.paid }, (_, i) => i + 1))
    this._idTransaction.set(item._id!);
    this.gestionTrasactionForm.patchValue({
      dayBuy: this.formatPipe.transform(item.dayBuy, 'YYYY-MM-DD'),
      description: item.description,
      tarjeta: item.tarjeta,
      totalAmount: item.totalAmount.toString(),
      interestPurchase: item.interestPurchase.toString(),
      installments: item.installments.toString(),
      installmentAmount: item.installmentAmount.toString(),
      totalInterestPerInstallment: item.totalInterestPerInstallment.toString(),
      nextPayment: this.formatPipe.transform(item.nextPayment, 'YYYY-MM-DD'),
      state: item.state.state,
      pending: item.state.pending,
      paid: item.state.paid,
    });
  }

  updatePending($event: any) {
    this.pendingIntallments.set($event.target.value)
  }

  updatePaid($event: any) {
    this.paid.set($event.target.value || 0)
  }

  updateTransactionSubmit() {
    if (!this.gestionTrasactionForm.valid) {
      return;
    }
    const body: Transaction = {
      tarjeta: this.gestionTrasactionForm.get('tarjeta')?.value!,
      description: this.gestionTrasactionForm.get('description')?.value!,
      totalAmount: Number(this.gestionTrasactionForm.get('totalAmount')?.value!),
      dayBuy: new Date(this.gestionTrasactionForm.get('dayBuy')?.value!),
      installments: Number(this.gestionTrasactionForm.get('installments')?.value!),
      interestPurchase: Number(this.gestionTrasactionForm.get('interestPurchase')?.value!),
      installmentAmount: Number(this.gestionTrasactionForm.get('installmentAmount')?.value!),
      totalInterestPerInstallment: Number(this.gestionTrasactionForm.get('totalInterestPerInstallment')?.value!),
      nextPayment: new Date(this.gestionTrasactionForm.get('nextPayment')?.value!),
      state: {
        state: this.gestionTrasactionForm.get('state')?.value!,
        pending: Number(this.pendingIntallments()) ? Number(this.pendingIntallments()) : this.gestionTrasactionForm.get('pending')?.value!,
        paid: Number(this.paid()) ? Number(this.paid()) : 0,
      },
      _id: this._idTransaction(),
    }

    Swal.fire({
      title: 'Actualizando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.tdcService.createTransactionByCard(body).subscribe({
      next: (res) => {
        this.getCreditCard();
        this.creditCardsTransactions().find((transaction) => transaction._id === this._idTransaction())!.state = body.state;
        Swal.close();
      },
      error: (err) => {
        console.log('err', err);
      },
    })
  }


  deleteTransaction(item: Transaction) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Borrará la transaccion de la tarjeta ' + item.tarjeta + ' con el nombre ' + item.description,
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
        this.tdcService.deleteTransactionByCard(item.tarjeta, item._id!).subscribe({
          next: (res) => {
            this.getCreditCard();
            this.creditCardsTransactions.update((prev) => prev.filter((transaction) => transaction._id !== item._id));
            Swal.close();
            Swal.fire(
              'Eliminado',
              'La transaccion con la tarjeta ' + item.tarjeta + ' ha sido eliminado.',
              'success'
            );
          },
          error: async (err) => {
            console.error(err);
            Swal.close();
            await Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'La transaccion ya se encuentra eliminada.',
              timer: 2000,
              showConfirmButton: false,
            });
          },
        });
      } else if (borrar.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          `La transaccion con la tarjeta ${item.tarjeta} está a salvo :)`,
          'info'
        );
      }
    });
  }
}
