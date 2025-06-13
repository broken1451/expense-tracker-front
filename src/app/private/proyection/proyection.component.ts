import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Chart, { ChartTypeRegistry } from 'chart.js/auto';
import { GraficComponent } from './grafic/grafic.component';

@Component({
  selector: 'app-proyection',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyection.component.html',
  styleUrl: './proyection.component.scss'
})
export class ProyectionComponent implements AfterViewInit { // Agrega AfterViewInit para usar el hook

  private readonly fb: FormBuilder = inject(FormBuilder);
  public estimatedsavings = signal<string>('$0.00');
  public estimatedsavings2 = signal<string>('$0.00'); // Parece no usarse, considera eliminarla si es así.
  public showtimetotarget = signal<boolean>(false); // Parece no usarse, considera eliminarla si es así.

  public currentSavings = signal<string>(''); // Parece no usarse, considera eliminarla si es así.

  // Gráfico: Usamos 'chart' para la instancia de Chart.js
  // La referencia al canvas se obtiene con el signal 'savingsChartCanvasRef'
  public chart: Chart | null = null; // Esta propiedad guardará la instancia del gráfico
  public chartLabels = signal<string[]>([]); // Parece no usarse en el método actual.
  public chartData = signal<number[]>([]);   // Parece no usarse en el método actual.
  public current = signal<number>(0);        // Parece no usarse en el método actual.

  public proyectionForm = this.fb.group({
    currentSavings: [2000000, []],
    monthlyContribution: [500000, []],
    savingsGoalAmount: [12000000, []],
    timePeriod: [12, []],
  });

  // Referencias a elementos del DOM usando viewChild (Signals)
  public timetotargetcontainer = viewChild<ElementRef<HTMLDivElement>>('timetotargetcontainer'); // Tipo de elemento HTMLDivElement
  public timetotargetmessage = viewChild<ElementRef<HTMLDivElement>>('timetotargetmessage');     // Tipo de elemento HTMLDivElement
  public monthstotarget = viewChild<ElementRef<HTMLSpanElement>>('monthstotarget');               // Tipo de elemento HTMLSpanElement (si es un span)

  // Referencia al canvas del gráfico usando viewChild (Signal)
  public savingsChartCanvasRef = viewChild<ElementRef<HTMLCanvasElement>>('savingsChart');


  // Opcional: Si quieres dibujar el gráfico la primera vez que el componente se carga.
  ngAfterViewInit(): void {
    // Es buena idea llamar a calculateProjection() aquí para que el gráfico se muestre inicialmente
    // con los valores por defecto del formulario.
    // this.calculateProjection();
  }

  calculateProjection() {

    const body = {
      currentSavings: this.proyectionForm.get('currentSavings')?.value,
      monthlyContribution: this.proyectionForm.get('monthlyContribution')?.value,
      savingsGoalAmount: this.proyectionForm.get('savingsGoalAmount')?.value,
      timePeriod: this.proyectionForm.get('timePeriod')?.value
    };

    const timeToTargetContainer = this.timetotargetcontainer()?.nativeElement;
    const timeToTargetMessage = this.timetotargetmessage()?.nativeElement;
    const monthsToTargetOutput = this.monthstotarget()?.nativeElement;

    const estimatedSavings = (body.currentSavings ?? 0) + ((body.monthlyContribution ?? 0) * (body.timePeriod ?? 0));
    this.estimatedsavings.set(`$${estimatedSavings.toFixed(2)}`);

    // Asegúrate de que el contenedor exista antes de manipular su estilo
    if (timeToTargetContainer) {
      timeToTargetContainer.style.display = 'none';
    }

    const targetAmount = body.savingsGoalAmount ?? 0;
    const currentSavings = body.currentSavings ?? 0;
    const monthlyContribution = body.monthlyContribution ?? 0;
    // Obtén la referencia al canvas correctamente desde el signal viewChild
    const savingsChartCanvas = this.savingsChartCanvasRef()?.nativeElement;

    // IMPRESCINDIBLE: Verificar si el canvas existe antes de intentar crear el gráfico
    if (!savingsChartCanvas) {
      console.error("Error: Elemento canvas del gráfico no encontrado en el DOM.");
      return; // Salir del método si el canvas no está disponible
    }

    if (!isNaN(targetAmount) && targetAmount > 0) { // Si hay una meta válida...
      const remainingAmount = targetAmount - currentSavings; // ¿Cuánto dinero te falta para la meta?

      if (remainingAmount <= 0) {
        // ¡Meta ya alcanzada!
        if (timeToTargetContainer && timeToTargetMessage) {
          timeToTargetContainer.style.display = 'block';
          timeToTargetMessage.textContent = '¡Felicidades! Ya has alcanzado o superado tu meta.';
          if (monthsToTargetOutput) monthsToTargetOutput.textContent = ''; // Limpiar el texto de meses.
        }
      } else if (monthlyContribution > 0) {
        // ¿Cuántos meses te faltan para la meta con tu ahorro mensual?
        const monthsToReachTarget = Math.ceil(remainingAmount / monthlyContribution);
        if (timeToTargetContainer && timeToTargetMessage && monthsToTargetOutput) {
          timeToTargetContainer.style.display = 'block';
          timeToTargetMessage.textContent = 'Para alcanzar tu meta de ';
          monthsToTargetOutput.textContent = `${monthsToReachTarget} meses.`;
        }
      } else {
        // No puedes alcanzar la meta si no ahorras nada al mes.
        if (timeToTargetContainer && timeToTargetMessage) {
          timeToTargetContainer.style.display = 'block';
          timeToTargetMessage.textContent = 'No puedes alcanzar tu meta si no ahorras nada cada mes.';
          if (monthsToTargetOutput) monthsToTargetOutput.textContent = ''; // Limpiar el texto de meses.
        }
      }
    }

    // 6. ACTUALIZAR EL GRÁFICO MES A MES:
    this.chartData.set([currentSavings]);
    this.current.set(currentSavings);
    this.currentSavings.set(Number(currentSavings).toString());
    if (this.chartLabels().length > 0) {
      this.chartLabels.set([]);
    }
    for (let i = 1; i <= body.timePeriod!; i++) {
      this.current.update(value => value + monthlyContribution);
      this.chartData.update(data => [...data, this.current()]);
      this.chartLabels.update(labels => [...labels, `Mes ${i}`]);
    }

    if (this.chart) {
      this.chart.destroy();
      this.chart = null; // Establecer a null para una limpieza explícita
    }

    // Crea la NUEVA instancia del gráfico y ASÍGNASELA a la propiedad de la clase `this.chart`.
    this.chart = new Chart(savingsChartCanvas, {
      type: 'bar',
      data: {
        labels: this.chartLabels(), 
        datasets: [{
          label: 'Mi Dinero Creciendo',
          data: this.chartData(),
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad Ahorrada ($)'
            },
            min: currentSavings,
            // max: this.estimatedsavings(),
            ticks: {
              callback: function (value: any) { // Ajustado el tipo para mayor compatibilidad
                return '$' + value.toLocaleString();
              }
            }
          },
          x: {
            beginAtZero: false,
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
              label: function (context: any) { // Ajustado el tipo para mayor compatibilidad
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
}