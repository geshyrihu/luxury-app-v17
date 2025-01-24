import { Component, inject, OnInit } from "@angular/core";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { ApiRequestService } from "src/app/core/services/api-request.service";

@Component({
  selector: "app-legal-reports-pending",
  templateUrl: "./legal-reports-pending.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalReportsPendingComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);

  // Declaración e inicialización de variables
  dataExternal: any;
  dataInternal: any;
  unassignedData: any;
  ngOnInit(): void {
    this.onLoadDataExternal();
    this.onLoadDataInternal();
    this.onLoadUnassignedData();
  }

  onLoadDataExternal() {
    const urlApi = `LegalReport/Pending/1`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.dataExternal = result;
    });
  }
  onLoadDataInternal() {
    const urlApi = `LegalReport/Pending/0`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.dataInternal = result;
    });
  }
  onLoadUnassignedData() {
    // Your logic to load unassigned data goes here
    const urlApi = `LegalReport/PendingUnassignedData`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.unassignedData = result;
    });
  }
  sendReport() {
    const urlApi = `LegalReport/Report`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.dataInternal = result;
    });
  }
}
