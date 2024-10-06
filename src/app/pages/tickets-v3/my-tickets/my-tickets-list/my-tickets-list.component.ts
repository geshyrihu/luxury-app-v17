import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import TicketMessageAddOrEditComponent from '../../messages/ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import TicketMessageCloseComponent from '../../messages/ticket-message-close/ticket-message-close.component';
import { TicketMessageStatusComponent } from '../../shared/ticket-message-status/ticket-message-status.component';
import { TicketGroupService } from '../../ticket.service';
import MyTicketMessageAddComponent from '../my-ticket-message-add/my-ticket-message-add.component';
import MyTicketMessageProgramComponent from '../my-ticket-message-program/my-ticket-message-program.component';

@Component({
  selector: 'app-my-tickets-list',
  templateUrl: './my-tickets-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketMessageStatusComponent],
})
export default class MyTicketsListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  dialogHandlerService = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  activatedRoute = inject(ActivatedRoute);

  data: any[] = [];
  status: string = this.ticketGroupService.ticketGroupMessageStatus;

  urlAccount = environment.url_account;
  urlImage = this.ticketGroupService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );

  ngOnInit() {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    const urlApi = `TicketMessage/MyTicketMessage/${this.authService.applicationUserId}/${status}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.status = status;
    });
  }

  onProgram(id: string) {
    this.dialogHandlerService
      .openDialog(
        MyTicketMessageProgramComponent,
        { id: id },
        'Programar actividad',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onClosed(id: string) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageCloseComponent,
        { id: id },
        'Cerrar ticket',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onFollowUp(id: string) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageFollowupComponent,
        { id: id },
        'Comentarios',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageAddOrEditComponent,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }

  onModalAdd(data: any) {
    this.dialogHandlerService
      .openDialog(
        MyTicketMessageAddComponent,
        { id: data.id },
        data.title,
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }
}
