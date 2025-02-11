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
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  activatedRoute = inject(ActivatedRoute);

  data: any[] = [];
  status: string = this.ticketGroupService.ticketGroupMessageStatus;

  ngOnInit() {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    const urlApi = `Tickets/MyRequest/${this.authS.applicationUserId}/${status}/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.status = status;
    });
  }

  onFollowUp(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageFollowupComponent,
        { id: id },
        'Seguimiento',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageAddOrEditComponent,
        { id: data.id, ticketGroupId: data.ticketGroupId },
        data.title,
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }

  onModalAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        MyTicketMessageAddEditComponent,
        { id: data.id },
        data.title,
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.status);
        }
      });
  }
  onUpdatePriority(id: string) {
    const urlApi = `Tickets/UpdatePriority/${id}/${this.authS.applicationUserId}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
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
