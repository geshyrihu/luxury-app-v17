import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import TicketMessageAddOrEditComponent from '../../messages/ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import TicketMessageCloseComponent from '../../messages/ticket-message-close/ticket-message-close.component';
import TicketMessageReadListComponent from '../../messages/ticket-message-read-list/ticket-message-read-list.component';
import SendOperationReportComponent from '../../send-operation-report/send-operation-report.component';
import { ETicketMessageStatus } from '../../ticket-message-status.enum';
import { TicketMessageModule } from '../../ticket-message.module';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-operation-report',
  templateUrl: './ticket-message-operation-report.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketMessageModule],
})
export default class TicketMessageOperationReportComponent {
  activatedRoute = inject(ActivatedRoute);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  router = inject(Router);

  status: ETicketMessageStatus = ETicketMessageStatus.Cerrado;
  startDate: string = null;
  endDate: string = null;
  data: any[] = [];

  assignee: string = null;
  cb_assignee: ISelectItem[] = [];
  ticketGroupId: string = this.activatedRoute.snapshot.params.ticketGroupId;

  onLoadData() {
    this.ticketGroupService.setStatus(this.status);

    const urlApi = `TicketReport/WeeklyReport/${this.customerIdS.customerId}/${this.startDate}/${this.endDate}/${this.status}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    this.startDate = startDateFormatted;
    this.endDate = endDateFormatted;

    // Aquí puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData();
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageAddOrEditComponent,
        { id: data.id, ticketGroupId: this.ticketGroupId },
        'Agregar',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onChangeStatus(value: any) {
    this.status = value;
    this.onLoadData();
  }

  onView(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageReadListComponent,
        { id: id },
        'Vistas',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onClosed(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageCloseComponent,
        { id: id },
        'Cerrar ticket',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // Actualizar si el item es relevante o no
  onUpdateStateTicket(item: any) {
    const urlApi = `Tickets/UpdateRelevance/${item.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.customToastService.onCloseToSuccess();
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
        if (result) this.onLoadData();
      });
  }

  onPreviewClicked(): void {
    // Lógica para la vista previa
    this.router.navigate(['/tickets/weekly-report-preview']);
  }
  onSendReportClicked(): void {
    // Lógica para enviar el reporte
    this.dialogHandlerS
      .openDialog(
        SendOperationReportComponent,
        {},
        'Envio de reporte semanal',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
