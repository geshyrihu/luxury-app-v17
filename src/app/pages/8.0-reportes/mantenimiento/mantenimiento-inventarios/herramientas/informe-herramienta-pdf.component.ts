import { Component, OnInit, inject } from "@angular/core";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { ReporteHerramientasPdfService } from "src/app/core/services/reporte-herramientas-pdf.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-informe-herramienta-pdf",
  templateUrl: "./informe-herramienta-pdf.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class InformeHerramientaPdfComponent implements OnInit {
  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);
  customerIdService = inject(CustomerIdService);
  data: any[] = [];
  base_urlImg = "";

  ngOnInit(): void {
    this.urlImg();
    this.data = this.reporteHerramientasPdfService.getData();
  }
  urlImg(): void {
    this.base_urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/tools/`;
  }
}
