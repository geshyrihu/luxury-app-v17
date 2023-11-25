import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Component({
  selector: 'app-pie-grid',
  templateUrl: './pie-grid.component.html',
  styleUrls: ['./pie-grid.component.css'],
  standalone: true,
  imports: [NgApexchartsModule],
})
export default class PieGridComponent implements OnInit {
  ngOnInit() {}
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Servings',
          data: [56, 50, 2, 4],
        },
      ],

      chart: {
        height: 300,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          // endingShape: 'flat',
        },
      },
      // "start" | "middle" |
      dataLabels: {
        enabled: true,
        textAnchor: 'middle',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          colors: ['#000000'],
        },
      },
      stroke: {
        width: 2,
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: ['Total', 'Termiando', 'Pendiente', 'Denegado'],
        tickPlacement: 'off',
      },
      // yaxis: {
      //   title: {
      //     text: "Preventivos"
      //   }
      // },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    };
  }
}
export var datos = [
  {
    name: 'Total',
    value: 56,
  },
  {
    name: 'Concluido',
    value: 52,
  },
  {
    name: 'Pendiente',
    value: 4,
  },
];
