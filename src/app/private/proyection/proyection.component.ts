import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { GraficComponent } from './grafic/grafic.component';

@Component({
  selector: 'app-proyection',
  imports: [CommonModule, ReactiveFormsModule, GraficComponent],
  templateUrl: './proyection.component.html',
  styleUrl: './proyection.component.scss'
})
export class ProyectionComponent {

  private readonly fb: FormBuilder = inject(FormBuilder);
  public estimatedsavings = signal<string>('$0.00');
  public estimatedsavings2 = signal<string>('$0.00');
  public showtimetotarget = signal<boolean>(false);
  public monthstotarget = signal<string>('');


  public currentSavings = signal<string>('');

  // grafico
  @ViewChild('savingsChart') barChart!: ElementRef<HTMLCanvasElement>;
  public chart: Chart | null = null;
  public chartLabels = signal<string[]>([]);
  public chartData = signal<number[]>([]);
  public current = signal<number>(0);

  public proyectionForm = this.fb.group({
    currentSavings: [0, []],
    monthlyContribution: [0, []],
    savingsGoalAmount: [0, []],
    timePeriod: [0, []],
  });


  calculateProjection() {

    const body = {
      currentSavings: this.proyectionForm.get('currentSavings')?.value,
      monthlyContribution: this.proyectionForm.get('monthlyContribution')?.value,
      savingsGoalAmount: this.proyectionForm.get('savingsGoalAmount')?.value,
      timePeriod: this.proyectionForm.get('timePeriod')?.value
    }

    const currentSavings = body.currentSavings || 0;
    const monthlyContribution = body.monthlyContribution || 0;
    const timePeriod = body.timePeriod || 0;
    const targetAmount = body.savingsGoalAmount || 0;

    const estimatedSavings = currentSavings + (monthlyContribution * timePeriod);
    this.estimatedsavings.set(`$${estimatedSavings.toFixed(2)}`)
    this.estimatedsavings2.set(`$${estimatedSavings.toFixed(2)}`)

    if (!isNaN(targetAmount) && targetAmount > 0) {
      const remainingAmount = targetAmount - currentSavings;
      if (remainingAmount <= 0) {
        this.showtimetotarget.set(true);
        this.monthstotarget.set('¡Ya has alcanzado o superado tu meta!')
      } else if (monthlyContribution > 0) {
        const monthsToReachTarget = Math.ceil(remainingAmount / monthlyContribution);
        this.showtimetotarget.set(true);
        this.monthstotarget.set(String(monthsToReachTarget))
        console.log('here')
      } else {
        this.showtimetotarget.set(true);
        this.monthstotarget.set('No se puede alcanzar la meta sin contribuciones mensuales.');
      }
    } else {
      this.showtimetotarget.set(false);
    }

    this.chartData.set([currentSavings])
    this.current.set(currentSavings);
    this.currentSavings.set(Number(currentSavings).toString());
    if (this.chartLabels().length > 0) {
      this.chartLabels.set([]);
    }
    for (let i = 1; i <= timePeriod; i++) {
      this.current.update(value => value + monthlyContribution);
      this.chartData.update(data => [...data, this.current()]);
      this.chartLabels.update(labels => [...labels, `Mes ${i}`]);
    }

    // const ctx = this.barChart.nativeElement.getContext('2d')!;
    // if (this.chart) {
    //   this.chart.destroy();
    // }

    // this.chart = new Chart(ctx, {
    //   type: 'bar' as keyof ChartTypeRegistry,
    //   data: {
    //     labels: this.chartLabels(),
    //     datasets: [{
    //       label: 'Ahorros proyectados',
    //       data: this.chartData(),
    //       backgroundColor: 'rgba(75, 192, 192, 0.7)',
    //       borderColor: 'rgba(75, 192, 192, 1)',
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: false,
    //         min: currentSavings,
    //         max: this.estimatedsavings(),
    //         ticks: {
    //           callback: function (value, index, values) {
    //             return '$' + value.toLocaleString(); // Formatear como moneda
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
    

  }
}
