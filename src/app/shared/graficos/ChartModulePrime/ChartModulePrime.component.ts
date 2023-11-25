import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-chart-module-prime',
  templateUrl: './ChartModulePrime.component.html',
  standalone: true,
  imports: [ChartModule],
})
export default class ChartModulePrimeComponent implements OnInit {
  @Input()
  labels: string[] = [];
  @Input()
  label: string = '';
  data: any;
  @Input()
  lecturas: number[] = [];

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: this.label,
          data: this.lecturas,
          // data: [
          //   175258, 175330, 175466, 175489, 175517, 175518, 175518, 175603,
          //   175606, 175651, 175763, 175967, 176491, 175517, 176234, 176750,
          //   176898, 176938, 176995, 177027, 176959, 176915, 177200, 177414,
          //   177691, 177950, 178236, 178322, 178422, 178621, 178502, 178464,
          // ],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
