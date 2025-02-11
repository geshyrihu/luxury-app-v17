import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import DashboardDynamicCardItemComponent from './dashboard-dynamic-card-item.component';
import MantenimientosPreventivosResumenComponent from './summary-preventive-maintenance.component';

@Component({
    selector: 'app-dashboard-preventive-maintenance',
    templateUrl: './dashboard-preventive-maintenance.component.html',
    imports: [LuxuryAppComponentsModule, DashboardDynamicCardItemComponent]
})
export default class DashboardPreventiveMaintenanceComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  customerIdS = inject(CustomerIdService);
  periodoMonthService = inject(PeriodoMonthService);

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  data: any = [];

  onChangePeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadOrdenServicio();
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.onLoadOrdenServicio();
    this.customerId$.subscribe(() => {
      this.onLoadOrdenServicio();
    });
  }

  onLoadOrdenServicio() {
    const urlApi = `Dashboard/OrdenesServicio/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onClick(estatus?: number) {
    this.dialogHandlerS.openDialog(
      MantenimientosPreventivosResumenComponent,
      {
        estatus,
      },
      'Ordenes de Mantenimiento Preventivo',
      this.dialogHandlerS.dialogSizeFull
    );
  }
}
