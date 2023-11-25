import { Component, Input } from '@angular/core';
import { PieChartModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  standalone: true,
  imports: [PieChartModule],
})
export default class AdvancedPieChartComponent {
  // options
  view: any = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  @Input()
  dataGrafico: any[] = [];
  @Input()
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };
}
