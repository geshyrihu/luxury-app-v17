import { Component, inject } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { ReportService } from "src/app/core/services/report.service";

@Component({
    selector: "app-resumen-minuta-grafico",
    templateUrl: "./resumen-minuta-grafico.component.html",
    imports: [LuxuryAppComponentsModule, NgxChartsModule]
})
export default class ResumenMinutaGraficoComponent {
  public reportService = inject(ReportService);
  view: [number, number] = [700, 400];

  get single() {
    return this.reportService.getDateGrafico();
  }

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme: any = {
    domain: ["#5AA454", "#A10A28", "#3b3838"],
  };
}
