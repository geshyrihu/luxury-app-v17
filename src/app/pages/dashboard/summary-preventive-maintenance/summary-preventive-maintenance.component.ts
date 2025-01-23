import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-summary-preventive-maintenance',
  templateUrl: './summary-preventive-maintenance.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MantenimientosPreventivosResumenComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  periodoMonthService = inject(PeriodoMonthService);
  dateService = inject(DateService);

  data: any[] = [];
  ref: DynamicDialogRef;
  estatus: number;

  ngOnInit(): void {
    this.estatus = this.config.data.estatus;
    this.onLoadData(this.estatus);
  }
  onLoadData(status: any) {
    const urlApi = `Dashboard/ServiceOrderSummary/${this.custIdService.getCustomerId()}/${status}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
