import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
    selector: 'app-report-supervision',
    imports: [LuxuryAppComponentsModule],
    templateUrl: './report-supervision.component.html'
})
export default class ReportSupervisionComponent implements OnInit {
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);

  nameCustomer = '';
  photoPath = '';

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  customerId = this.customerIdS.getCustomerId();

  minutas: any;
  tickets: any;
  pendingLegal: any;
  envioFinancieros: any;
  ngOnInit(): void {
    this.onLoadData(this.customerId);
    this.customerId$.subscribe((customerId) => {
      this.nameCustomer = this.customerIdS.nameCustomer;
      this.photoPath = this.customerIdS.photoPath;
      this.onLoadData(customerId);
    });
  }

  onLoadData(customerId: number) {
    this.onLoadDataMinutas(customerId);
    this.onLoadDataTickets(customerId);
    this.onLoadDataPendingLegal(customerId);
    this.onLoadDataEnvioFinancieros(customerId);
  }
  onLoadDataMinutas(customerId: number) {
    const urlApi = `ReportSupervision/PendingMinutes/${customerId}`;
    this.apiRequestS.onGetList(urlApi).then((response: any) => {
      this.minutas = response;
    });
  }
  onLoadDataTickets(customerId: number) {
    const urlApi = `ReportSupervision/PendingTickets/${customerId}`;
    this.apiRequestS.onGetList(urlApi).then((response: any) => {
      this.tickets = response;
    });
  }
  onLoadDataPendingLegal(customerId: number) {
    const urlApi = `ReportSupervision/PendingLegal/${customerId}`;
    this.apiRequestS.onGetList(urlApi).then((response: any) => {
      this.pendingLegal = response;
    });
  }
  onLoadDataEnvioFinancieros(customerId: number) {
    const urlApi = `ReportSupervision/EstadosFinancieros/${customerId}`;
    this.apiRequestS.onGetList(urlApi).then((response: any) => {
      this.envioFinancieros = response;
    });
  }
}
