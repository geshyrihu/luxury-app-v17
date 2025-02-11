import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
    selector: 'app-report-entrada-almacen',
    templateUrl: './report-entrada-almacen.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ReportEntradaAlmacenComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  data: any[] = [];
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
    const urlApi = `MaintenanceReport/entradaproducto/${
      this.customerIdS.customerId
    }/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoInicio)}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
