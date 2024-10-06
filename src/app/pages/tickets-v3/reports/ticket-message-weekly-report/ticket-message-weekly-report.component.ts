import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import TicketMessageAddOrEditComponent from '../../messages/ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import TicketMessageCloseComponent from '../../messages/ticket-message-close/ticket-message-close.component';
import TicketMessageReadListComponent from '../../messages/ticket-message-read-list/ticket-message-read-list.component';
import TicketDateRangeSelectorComponent from '../../shared/ticket-date-range-selector/ticket-date-range-selector.component';
import { TicketMessageStatusComponent } from '../../shared/ticket-message-status/ticket-message-status.component';
import TicketReportActionsComponent from '../../shared/ticket-report-actions/ticket-report-actions.component';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-weekly-report',
  templateUrl: './ticket-message-weekly-report.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    TicketMessageStatusComponent,
    TicketDateRangeSelectorComponent,
    TicketReportActionsComponent,
  ],
})
export default class TicketMessageWeeklyReportComponent {
  activatedRoute = inject(ActivatedRoute);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dialogHandlerService = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  router = inject(Router);

  status: number = this.ticketGroupService.ticketGroupMessageStatus;
  startDate: string = null;
  endDate: string = null;
  data: any[] = [];

  assignee: string = null;
  cb_assignee: ISelectItem[] = [];
  ticketGroupId: string = this.activatedRoute.snapshot.params.ticketGroupId;

  urlAccount = environment.url_account;
  urlImage = this.ticketGroupService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );
  onLoadData() {
    const urlApi = `TicketReport/WeeklyReport/${this.customerIdService.customerId}/${this.startDate}/${this.endDate}/${this.status}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    console.log('Fechas seleccionadas:', event.startDate, event.endDate);

    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    this.startDate = startDateFormatted;
    this.endDate = endDateFormatted;

    // Aquí puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData();
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageAddOrEditComponent,
        { id: data.id, ticketGroupId: this.ticketGroupId },
        'Agregar',
        this.dialogHandlerService.dialogSizeLg
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
    this.dialogHandlerService
      .openDialog(
        TicketMessageReadListComponent,
        { id: id },
        'Vistas',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
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
        if (result) this.onLoadData();
      });
  }

  // Actualizar si el item es relevante o no
  onUpdateStateTicket(item: any) {
    const urlApi = `TicketMessage/UpdateRelevance/${item.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.customToastService.onCloseToSuccess();
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
        if (result) this.onLoadData();
      });
  }

  onPreviewClicked(): void {
    // Lógica para la vista previa
    this.router.navigate(['/luxury-chat/weekly-report-preview']);
  }

  onSendReportClicked(): void {
    // Lógica para enviar el reporte
    console.log('Enviar Reporte seleccionado');
  }
}
