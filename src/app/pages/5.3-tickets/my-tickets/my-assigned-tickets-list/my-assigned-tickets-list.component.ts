import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CardEmployeeComponent from 'src/app/pages/6.1-directorios/employee/card-employee/card-employee.component';
import Swal from 'sweetalert2';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import TicketMessageAddOrEditComponent from '../../messages/ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import TicketMessageCloseComponent from '../../messages/ticket-message-close/ticket-message-close.component';
import TicketMessageReopenComponent from '../../messages/ticket-message-reopen/ticket-message-reopen.component';
import { TicketMessageModule } from '../../ticket-message.module';
import { TicketGroupService } from '../../ticket.service';
import MyTicketMessageAddEditComponent from '../my-ticket-message-addedit/my-ticket-message-add.component';
import MyTicketMessageProgramComponent from '../my-ticket-message-program/my-ticket-message-program.component';

@Component({
  selector: 'app-my-assigned-tickets-list',
  templateUrl: './my-assigned-tickets-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketMessageModule],
})
export default class MyAssignedTicketsListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  dialogHandlerService = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  customerIdService = inject(CustomerIdService);
  activatedRoute = inject(ActivatedRoute);

  status: string = this.ticketGroupService.ticketGroupMessageStatus;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData(this.status);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.status);
    });
  }

  data: any[] = [];
  filteredData: any[] = []; // Para almacenar la data filtrada
  searchText: string = ''; // Para almacenar el texto de búsqueda

  onLoadData(status: any) {
    const urlApi = `TicketMessage/MyAssignedTickets/${this.authS.applicationUserId}/${status}/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.filteredData = result; // Inicializa la data filtrada
      this.status = status;
    });
  }

  onSearch() {
    this.filteredData = this.data.filter((item) =>
      item.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  getTruncatedDescription(description: string): string {
    return description.length > 100
      ? description.slice(0, 100) + '...'
      : description;
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
  onReopen(id: string) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageReopenComponent,
        { id: id },
        'Re abrir ticket',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerService.dialogSizeMd
    );
  }

  onProgress(id: string) {
    Swal.fire({
      title: 'Confirmar',
      text: 'Se colocara el ticket en proceso',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#50C878',
      cancelButtonColor: '#9B1B30',
      confirmButtonText: 'Si, en proceso!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        const urlApi = `TicketMessage/InProgress/${id}/${this.authS.applicationUserId}`;

        this.apiRequestService.onGetItem(urlApi).then((result: any) => {
          // Actualizamos el valor del signal con los datos recibidos
          this.onLoadData(this.status);
        });
      }
    });
  }
}
