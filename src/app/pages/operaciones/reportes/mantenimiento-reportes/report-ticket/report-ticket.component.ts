import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import ReporteTicketsComponent from 'src/app/pages/operaciones/supervision/reporte-tickets/reporte-tickets.component';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import { environment } from 'src/environments/environment';
const base_urlImg = environment.base_urlImg;

@Component({
  selector: 'app-report-ticket',
  templateUrl: './report-ticket.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    PagetitleReportComponent,
    ReporteTicketsComponent,
  ],
})
export default class ReportTicketComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateService = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  data: any;
  dataResponsable: any;
  dataCargaTicket: any;
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = base_urlImg;
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
    const periodo = this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    );
    console.log('🚀 ~ periodo:', periodo);
    const urlApi = `MaintenanceReport/ticket/${this.customerIdService.customerId}/${periodo}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });

    const urlApi2 = `MaintenanceReport/ticketresponsable/${this.customerIdService.customerId}/${periodo}`;
    this.apiRequestService.onGetList(urlApi2).then((result: any) => {
      this.dataResponsable = result;
    });

    const urlApi3 = `MaintenanceReport/cargaticket/${this.customerIdService.customerId}/${periodo}`;
    this.apiRequestService.onGetList(urlApi3).then((result: any) => {
      this.dataCargaTicket = result;
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
