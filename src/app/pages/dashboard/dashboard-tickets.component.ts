import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import DashboardDynamicCardItemComponent from './dashboard-dynamic-card-item.component';
import SummaryTicketsComponent from './summary-tickets.component';

@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, DashboardDynamicCardItemComponent],
})
export default class DashboardTicketsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);

  data: any[] = [];
  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  ref: DynamicDialogRef;

  ngOnInit(): void {
    // this.customerId$ = this.custIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `Dashboard/TicketPending/${this.custIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onLoadResumen(groupId: number) {
    this.dialogHandlerService.openDialog(
      SummaryTicketsComponent,
      {
        groupId,
      },
      'Pendientes',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
