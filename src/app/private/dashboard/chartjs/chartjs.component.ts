import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, inject, Input, input, OnChanges, OnInit, signal, SimpleChanges, viewChild, ViewChild } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-chartjs',
  imports: [],
  templateUrl: './chartjs.component.html',
  styleUrl: './chartjs.component.scss',
})
export class GraficoComponent implements AfterViewInit, OnChanges {

  public doughnutChart = viewChild<ElementRef<HTMLCanvasElement>>('doughnutChart');
  public chartData = input<number[]>([]);
  public chartLabels = input<string[]>([]);
  public backgroundColor = input<string[]>([]);
  public borderColor = input<string[]>([]);
  public chart: Chart | null = null;
  public chartType = 'doughnut';  

  constructor() {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels'] || changes['backgroundColor'] || changes['borderColor']) {
      this.createChart();
    }
  }

  createChart(): void {
    const canvasRef = this.doughnutChart();
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
      type: this.chartType as keyof ChartTypeRegistry,
      data: {
        labels: this.chartLabels(),
        datasets: [
          {
            label: 'Gastos por Categoría',
            data: this.chartData(),
            backgroundColor: this.backgroundColor(),
            borderColor: this.borderColor(),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
