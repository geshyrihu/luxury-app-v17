import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import TicketMessageAddOrEditComponent from '../../messages/ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import { TicketMessageModule } from '../../ticket-message.module';
import { TicketGroupService } from '../../ticket.service';
import MyTicketMessageAddEditComponent from '../my-ticket-message-addedit/my-ticket-message-add.component';

@Component({
  selector: 'app-my-requests-ticket-message',
  templateUrl: './my-requests-ticket-message.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketMessageModule],
})
export default class MyRequestsTicketMessageComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  dialogHandlerService = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  custIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  activatedRoute = inject(ActivatedRoute);

  data: any[] = [];
  status: string = this.ticketGroupService.ticketGroupMessageStatus;

  ngOnInit() {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    const urlApi = `Tickets/MyRequest/${this.authS.applicationUserId}/${status}/${this.custIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.status = status;
    });
  }

  onFollowUp(id: string) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageFollowupComponent,
        { id: id },
        'Seguimiento',
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
        MyTicketMessageAddEditComponent,
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
  onUpdatePriority(id: string) {
    const urlApi = `Tickets/UpdatePriority/${id}/${this.authS.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      if (result) {
        // Encuentra el índice del ítem con el ID proporcionado
        const itemIndex = this.data.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          // Cambia la prioridad del ítem
          const currentPriority = this.data[itemIndex].priority;

          // Alterna entre 'alta' y 'baja'
          this.data[itemIndex].priority =
            currentPriority === 'Alta' ? 'Baja' : 'Alta';
        }
      }
    });
  }
}
