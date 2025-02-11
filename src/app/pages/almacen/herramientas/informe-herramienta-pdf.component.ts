import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ReporteHerramientasPdfService } from 'src/app/core/services/reporte-herramientas-pdf.service';

@Component({
    selector: 'app-informe-herramienta-pdf',
    templateUrl: './informe-herramienta-pdf.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class InformeHerramientaPdfComponent implements OnInit {
  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  ngOnInit(): void {
    this.data = this.reporteHerramientasPdfService.getData();
  }
}
