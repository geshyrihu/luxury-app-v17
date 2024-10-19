import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import DashboardTicketsResumenComponent from '../dashboard-tickets-resumen/dashboard-tickets-resumen.component';
@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DashboardTicketsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;

  ngOnInit(): void {
    // this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `Dashboard/TicketPendientes/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onLoadResumen(responsibleAreaId: number) {
    this.dialogHandlerService.openDialog(
      DashboardTicketsResumenComponent,
      {
        responsibleAreaId,
      },
      'Pendientes',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
