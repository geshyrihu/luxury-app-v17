import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IChartData } from 'src/app/core/interfaces/chart-data.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import MultiAxisChartComponent from 'src/app/shared/graficos/primeng-chart/multi-axis-chart/multi-axis-chart.component';

@Component({
    selector: 'app-report-consumos',
    templateUrl: './report-consumos.component.html',
    imports: [LuxuryAppComponentsModule, MultiAxisChartComponent]
})
export default class ReportConsumosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  medidores: IChartData[] = [];
  title: string = '';
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MaintenanceReport/DataGraficoMensual/${this.customerIdS.getCustomerId()}/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.medidores = responseData;
    });
  }
}
