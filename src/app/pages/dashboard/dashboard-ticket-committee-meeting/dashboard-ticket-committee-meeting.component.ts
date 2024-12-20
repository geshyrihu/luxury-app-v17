import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import DashboardDynamicCardItemComponent from '../dashboard-dynamic-card-item/dashboard-dynamic-card-item.component';
import SummaryTicketCommitteeMeetingComponent from '../summary-ticket-committee-meeting/summary-ticket-committee-meeting.component';

@Component({
  selector: 'app-dashboard-ticket-committee-meeting',
  templateUrl: './dashboard-ticket-committee-meeting.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, DashboardDynamicCardItemComponent],
})
export default class DashboardTicketCommitteeMeetingComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData(this.customerIdService.getCustomerId());
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.customerIdService.getCustomerId());
    });
  }

  onLoadData(customerId: number) {
    const urlApi = `Dashboard/MinutasPendientes/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEditMinutaDetalle(statusKey: number) {
    console.log('🚀 ~ eAreaMinutasDetalles:', statusKey);
    let titulo: string = '';

    if (statusKey == 0) {
      titulo = 'Contable';
    }
    if (statusKey == 1) {
      titulo = 'Operaciones';
    }
    if (statusKey == 2) {
      titulo = 'Legal';
    }

    this.dialogHandlerService.openDialog(
      SummaryTicketCommitteeMeetingComponent,
      {
        eAreaMinutasDetalles: statusKey,
      },
      'Pendientes ' + titulo,
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
