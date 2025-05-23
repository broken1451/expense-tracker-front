import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import dayjs from 'dayjs'
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { GraficoComponent } from './chartjs/chartjs.component';
import { AuthService } from '../../public/login/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, SlicePipe, GraficoComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public readonly expenseService: ExpenseService = inject(ExpenseService);
  private readonly authService: AuthService = inject(AuthService);
  public readonly router: Router = inject(Router);
  public totalAmount = signal(0);
  public totalIncome = signal(0);
  public balance = signal(0);
  public date = signal(dayjs().format('DD/MM/YYYY'));
  public expenses = this.expenseService.expenses;
  public userLogin = this.authService.user;

  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>; 
  public chart: Chart | null = null;
  public chartLabels = signal<string[]>([]);
  public chartData = signal<number[]>([]);
  public chartType = signal<string>('doughnut');
  public chartBackgroundColor = signal<string[]>([]);
  public chartborderColor = signal<string[]>([]);

  constructor() { }

  ngOnInit(): void {
    let totalExpenses = 0;
    const categoryAmounts: { [key: string]: number } = {};
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
    const defaultBackgroundColors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
    ];
    const defaultBorderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];

    this.expenseService.getExpenses().subscribe({
      next: (res) => {
        this.totalIncome.set(res.totalIngress);
        this.expenses()?.forEach((expense) => {
          this.totalAmount.update(() => this.totalAmount() + expense.amount);
          expense.date = this.converDate(expense.date);
          totalExpenses += expense.amount;
          categoryAmounts[expense.category] = (categoryAmounts[expense.category] || 0) + expense.amount;
        });

        this.chartLabels.set(Object.keys(categoryAmounts));
        this.chartData.set(Object.values(categoryAmounts));

        Object.keys(categoryAmounts).forEach((_, index) => {
          backgroundColors.push(defaultBackgroundColors[index % defaultBackgroundColors.length]);
          borderColors.push(defaultBorderColors[index % defaultBorderColors.length]);
        });
        this.chartBackgroundColor.set(backgroundColors);
        this.chartborderColor.set(borderColors);
        this.balance.set(this.userLogin()?.user?.salary! - totalExpenses);
      },
      error: (err) => {
        console.error('err', err);
        this.authService.logout();
        this.router.navigate(['/public/login']);
      }
    });
  }

  converDate(date: Date) {
    const dateFormat = dayjs(date).add(1, 'day').format('DD/MM/YYYY');
    return dateFormat;
  }

  createDoughnutChart(): void {
    const ctx = this.barChart.nativeElement.getContext('2d')!;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: this.chartType() as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabels(),
        datasets: [{
          label: 'Gastos por Categoría',
          data: this.chartData(),
          backgroundColor: this.chartBackgroundColor(),
          borderColor: this.chartborderColor(),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }
}