import { AfterViewInit, Component, ElementRef, Input, input, OnChanges, SimpleChanges, ViewChild, viewChild, signal } from '@angular/core';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';

@Component({
  selector: 'app-grafic',
  imports: [],
  templateUrl: './grafic.component.html',
  styleUrl: './grafic.component.scss'
})
export class GraficComponent implements OnChanges {

  @ViewChild('savingsChartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() labels: string[] = []; // Datos de entrada: etiquetas para el eje X
  @Input() data: number[] = [];   // Datos de entrada: valores para las barras/líneas
  @Input() chartLabel: string = 'Mi Dinero Creciendo'; // Etiqueta para el conjunto de datos (opcional)
  @Input() chartType: keyof ChartTypeRegistry = 'bar'; // Tipo de gráfico (bar, line, etc.)

  private chartInstance: Chart | null = null; // Propiedad para almacenar la instancia del gráfico

  ngAfterViewInit(): void {
    // Renderiza el gráfico inicial una vez que la vista del componente ha sido inicializada
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en los inputs (labels o data) y actualiza/redibuja el gráfico
    if ((changes['labels'] && !changes['labels'].firstChange) || (changes['data'] && !changes['data'].firstChange)) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    // Destruye la instancia del gráfico cuando el componente se destruye para evitar fugas de memoria
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private renderChart(): void {
    const ctx = this.chartCanvasRef?.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Error: No se encontró el contexto 2D del canvas para el gráfico.');
      return;
    }

    // Destruye el gráfico existente antes de crear uno nuevo si ya existe una instancia
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    this.chartInstance = new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.chartLabel,
          data: this.data,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Permite que el gráfico ocupe el tamaño de su contenedor
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad Ahorrada ($)'
            },
            ticks: {
              callback: function (value: any) {
                return '$' + value.toLocaleString();
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Meses Proyectados'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += '$' + context.parsed.y.toLocaleString();
                return label;
              }
            }
          }
        }
      }
    });
  }

  private updateChart(): void {
    if (this.chartInstance) {
      // Si el gráfico ya existe, simplemente actualiza sus datos
      this.chartInstance.data.labels = this.labels;
      this.chartInstance.data.datasets[0].data = this.data;
      this.chartInstance.update(); // Manda a redibujar el gráfico con los nuevos datos
    } else {
      // Si no hay instancia (ej. primera carga), renderiza el gráfico
      this.renderChart();
    }
  }


  // public savingsChart = viewChild<ElementRef<HTMLCanvasElement>>('savingsChart');
  // public chartData = input<number[]>([]);
  // public chartLabels = input<string[]>([]);
  // public currentSavings = input<number>(0);
  // public chart: Chart | null = null;
  // public chartType = 'bar';

  // ngAfterViewInit(): void {
  //   this.createChart();
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['chartData'] || changes['chartLabels'] || changes['backgroundColor'] || changes['borderColor']) {
  //     this.createChart();
  //   }
  // }

  // createChart(): void {
  //   const canvasRef: any= this.savingsChart()?.nativeElement;
  //   if (!canvasRef) {
  //     return;
  //   }
  //   const ctx = canvasRef.getContext('2d');
  //   if (!ctx) {
  //     console.error('No se pudo obtener el contexto 2D del canvas.');
  //     return;
  //   }

  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //     this.chart = new Chart(canvasRef!, {
  //     type: 'bar',
  //     data: {
  //       labels: this.chartLabels(),
  //       datasets: [{
  //         label: 'Mi Dinero Creciendo', // Un título más amigable para la leyenda.
  //         data: this.chartData(),
  //         backgroundColor: 'rgba(40, 167, 69, 0.7)', // Un verde más amigable.
  //         borderColor: 'rgba(40, 167, 69, 1)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       responsive: true, // El gráfico se adapta al tamaño del contenedor.
  //       maintainAspectRatio: false, // Permite controlar el tamaño del gráfico con CSS.
  //       scales: {
  //         y: {
  //           max: this.currentSavings() ,
  //           beginAtZero: false, // Empezar el eje Y desde 0 para mayor claridad.
  //           title: { // Título del eje Y.
  //             display: true,
  //             text: 'Cantidad Ahorrada ($)'
  //           },
  //           ticks: {
  //             callback: function (value) {
  //               return '$' + value.toLocaleString(); // Formato de moneda.
  //             }
  //           }
  //         },
  //         x: {
  //           title: { // Título del eje X.
  //             display: true,
  //             text: 'Meses Proyectados'
  //           }
  //         }
  //       },
  //       plugins: {
  //         legend: { // Configuración de la leyenda del gráfico.
  //           display: true,
  //           position: 'top' // Colocar la leyenda arriba.
  //         },
  //         tooltip: { // Configuración de los tooltips (cuando pasas el mouse por las barras).
  //           callbacks: {
  //             label: function (context) {
  //               let label = context.dataset.label || '';
  //               if (label) {
  //                 label += ': ';
  //               }
  //               label += '$' + context.parsed.y.toLocaleString();
  //               return label;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

}
