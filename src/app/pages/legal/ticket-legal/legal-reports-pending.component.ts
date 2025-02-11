import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-legal-reports-pending',
  templateUrl: './legal-reports-pending.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalReportsPendingComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);

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
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.dataExternal = responseData;
    });
  }
  onLoadDataInternal() {
    const urlApi = `LegalReport/Pending/0`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.dataInternal = responseData;
    });
  }
  onLoadUnassignedData() {
    // Your logic to load unassigned data goes here
    const urlApi = `LegalReport/PendingUnassignedData`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.unassignedData = responseData;
    });
  }
  sendReport() {
    const urlApi = `LegalReport/Report`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.dataInternal = responseData;
    });
  }
}
