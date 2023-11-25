import { Component, inject } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReporteOrdenesServicioService } from 'src/app/core/services/reporte-ordenes-servicio.service';

@Component({
  selector: 'app-resumen-ordenes-servicio-grafico',
  templateUrl: './resumen-ordenes-servicio-grafico.component.html',
  standalone: true,
  imports: [NgxChartsModule],
})
export default class ResumenOrdenesServicioGraficoComponent {
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);

  get single() {
    return this.reporteOrdenesServicioService.getDateGrafico();
  }

  // options
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#3b3838'],
  };
}
