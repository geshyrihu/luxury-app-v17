import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import DashboardDynamicCardItemComponent from '../dashboard-dynamic-card-item/dashboard-dynamic-card-item.component';
import MantenimientosPreventivosResumenComponent from '../summary-preventive-maintenance/summary-preventive-maintenance.component';

@Component({
  selector: 'app-dashboard-preventive-maintenance',
  templateUrl: './dashboard-preventive-maintenance.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, DashboardDynamicCardItemComponent],
})
export default class DashboardPreventiveMaintenanceComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  dateService = inject(DateService);
  custIdService = inject(CustomerIdService);
  periodoMonthService = inject(PeriodoMonthService);

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  data: any = [];

  onChangePeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadOrdenServicio();
  }

  ngOnInit(): void {
    this.customerId$ = this.custIdService.getCustomerId$();
    this.onLoadOrdenServicio();
    this.customerId$.subscribe(() => {
      this.onLoadOrdenServicio();
    });
  }

  onLoadOrdenServicio() {
    const urlApi = `Dashboard/OrdenesServicio/${this.custIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onClick(estatus?: number) {
    this.dialogHandlerService.openDialog(
      MantenimientosPreventivosResumenComponent,
      {
        estatus,
      },
      'Ordenes de Mantenimiento Preventivo',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
