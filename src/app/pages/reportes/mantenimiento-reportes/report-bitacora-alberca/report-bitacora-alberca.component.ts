import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import CustomBarChartComponent from 'src/app/shared/graficos/ng2-chart/custom-bar-chart/custom-bar-chart.component';

@Component({
    selector: 'app-report-bitacora-alberca',
    templateUrl: './report-bitacora-alberca.component.html',
    imports: [
        LuxuryAppComponentsModule,
        CustomBarChartComponent,
        PagetitleReportComponent,
    ]
})
export default class ReportBitacoraAlbercaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  medidores: any[] = [];
  title: string = '';
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MaintenanceReport/bitacoraalbercaparametros/${this.customerIdS.getCustomerId()}/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.medidores = responseData;
    });
  }
}
