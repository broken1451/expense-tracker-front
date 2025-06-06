import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';

@Component({
  selector: 'app-grafic',
  imports: [],
  templateUrl: './grafic.component.html',
  styleUrl: './grafic.component.scss'
})
export class GraficComponent implements AfterViewInit, OnChanges {

  public barChart = viewChild<ElementRef<HTMLCanvasElement>>('savingsChart');
  public chartData = input<number[]>([]);
  public chartLabels = input<string[]>([]);
  public backgroundColor = input<string[]>([]);
  public borderColor = input<string[]>([]);
  public chart: Chart | null = null;
  public chartType = 'bar';
  
  public currentSavings = input<string>('');
  public estimatedsavings = input<string>('');

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels'] || changes['backgroundColor'] || changes['borderColor']) {
      this.createChart();
    }
  }

  createChart(): void {
    const canvasRef = this.barChart();
    if (!canvasRef) {
      return;
    }
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas.');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

      this.chart = new Chart(ctx, {
      type: 'bar' as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabels(),
        datasets: [{
          label: 'Ahorros proyectados',
          data: this.chartData(),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            min: this.currentSavings(),
            max: this.estimatedsavings(),
            ticks: {
              callback: function (value, index, values) {
                return '$' + value.toLocaleString(); // Formatear como moneda
              }
            }
          }
        }
      }
    });
  }

}
