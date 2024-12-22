import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';

@Component({
  selector: 'app-report-solicitud-compra',
  templateUrl: './report-solicitud-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, PagetitleReportComponent],
})
export default class ReportSolicitudCompraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  solicitudes: any;
  ordenesCompra: any;

  dataProvider: any = [];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

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
    const urlApi = `MaintenanceReport/solicitudinsumos/${
      this.customerIdService.customerId
    }/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.solicitudes = result.solicitudes;
      this.ordenesCompra = result.ordenesCompra;
    });
  }
}
