import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketGroupParticipantComponent from '../../participants/ticket-group-participant/ticket-group-participant.component';
import { ETicketMessageStatus } from '../../ticket-message-status.enum';
import { TicketGroupService } from '../../ticket.service';
import TicketGroupAddOrEditComponent from '../ticket-group-add-or-edit/ticket-group-add-or-edit.component';

@Component({
  selector: 'app-ticket-group-list',
  templateUrl: './ticket-group-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbDropdownModule, ButtonModule],
})
export default class TicketGroupListComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  swPush = inject(SwPush);
  router = inject(Router); // Injectamos Router.
  ticketGroupService = inject(TicketGroupService);

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  error: string = '';
  dataSignal = signal<any>(null);
  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe((_) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const customerId = this.customerIdS.getCustomerId();
    const applicationUserId = this.authS.applicationUserId;

    const urlApi = `ticketGroup/GetAllByClient/${customerId}/${applicationUserId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.dataSignal.set(responseData);
    });
  }
  onToggleStatus(id: string) {
    const urlApi = `ticketGroup/toggle-status/${id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.onLoadData();
    });
  }
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketGroupAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onModalParticipants(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketGroupParticipantComponent,
        data,
        'Integrantes del grupo',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        this.onLoadData();
      });
  }

  onNavigateMessage(
    ticketGroupId: string,
    ticketGroupMessageStatus: ETicketMessageStatus
  ) {
    // this.ticketGroupService.ticketGroupId = ticketGroupId;
    this.ticketGroupService.ticketGroupMessageStatus = ticketGroupMessageStatus;
    this.ticketGroupService.setStatus(ticketGroupMessageStatus);
    this.router.navigate(['/tickets/messages/' + ticketGroupId]);
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`ticketGroup/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id)
          );
      });
  }
}
