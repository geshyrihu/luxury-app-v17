import { Component, Input } from '@angular/core';
import { PieChartModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  standalone: true,
  imports: [PieChartModule],
})
export default class PieChartComponent {
  // options
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  @Input()
  dataGrafico: any[] = [
    {
      name: 'Germany',
      value: 8940000,
    },
    {
      name: 'USA',
      value: 5000000,
    },
  ];
  colorScheme: string | any = {
    domain: ['#5AA454', '#A10A28'],
  };
}
