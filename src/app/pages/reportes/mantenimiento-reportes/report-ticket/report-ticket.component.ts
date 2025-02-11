import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
    selector: 'app-report-ticket',
    templateUrl: './report-ticket.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ReportTicketComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateS = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  data: any;
  dataResponsable: any;
  dataCargaTicket: any;
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });

    this.periodoInicial$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const periodo = this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    );
    const urlApi = `MaintenanceReport/ticket/${this.customerIdS.customerId}/${periodo}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });

    const urlApi2 = `MaintenanceReport/TicketResponsable/${this.customerIdS.customerId}/${periodo}`;
    this.apiRequestS.onGetList(urlApi2).then((responseData: any) => {
      this.dataResponsable = responseData;
    });

    const urlApi3 = `MaintenanceReport/CargaTicket/${this.customerIdS.customerId}/${periodo}`;
    this.apiRequestS.onGetList(urlApi3).then((responseData: any) => {
      this.dataCargaTicket = responseData;
    });
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;
    let noAutorizado = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
      noAutorizado += resp.noAutorizado;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
      noAutorizado,
    };
  }
}
