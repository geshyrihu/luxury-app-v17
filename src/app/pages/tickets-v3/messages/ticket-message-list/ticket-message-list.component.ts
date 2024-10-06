import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import CardEmployeeComponent from '../../../employee/card-employee/card-employee.component';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import { TicketResult } from '../../interfaces/ticket-message-list';
import { TicketMessageStatusComponent } from '../../shared/ticket-message-status/ticket-message-status.component';
import { TicketGroupService } from '../../ticket.service';
import TicketMessageAddOrEditComponent from '../ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import TicketMessageCloseComponent from '../ticket-message-close/ticket-message-close.component';
import TicketMessageProgramComponent from '../ticket-message-program/ticket-message-program.component';
import TicketMessageReadListComponent from '../ticket-message-read-list/ticket-message-read-list.component';
import TicketMessageReopenComponent from '../ticket-message-reopen/ticket-message-reopen.component';
@Component({
  selector: 'app-ticket-message-list',
  templateUrl: './ticket-message-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketMessageStatusComponent],
})
export default class TicketMessageListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  dialogHandlerService = inject(DialogHandlerService);
  ticketGroupService = inject(TicketGroupService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  activatedRoute = inject(ActivatedRoute);

  data: TicketResult = {
    nameGroup: '',
    items: [],
  };

  originalData: TicketResult = {
    nameGroup: '',
    items: [],
  };
  assignee: string = null;
  cb_assignee: ISelectItem[] = [];
  ticketGroupId: string = this.activatedRoute.snapshot.params.ticketGroupId;
  status: string = this.ticketGroupService.ticketGroupMessageStatus;

  urlAccount = environment.url_account;
  urlImage = this.ticketGroupService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );

  ngOnInit(): void {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    const urlApi = `TicketMessage/List/${this.ticketGroupId}/${status}`;
    this.apiRequestService.onGetList(urlApi).then((result: TicketResult) => {
      this.data = result;
      this.originalData = JSON.parse(JSON.stringify(result)); // Copia profunda
      const uniqueResponsibles = Array.from(
        new Map(
          this.originalData.items.map((item) => [item.assigneeId, item])
        ).values()
      );

      this.cb_assignee = uniqueResponsibles.map((item) => ({
        value: item.assigneeId,
        label: item.assignee,
      }));

      this.cb_assignee.push({
        value: null,
        label: 'Mostrar todos',
      });
    });
  }

  onResponsibleChange(event: any) {
    if (event.target.value === 'null') {
      // Mostrar todos los elementos
      this.data.items = [...this.originalData.items]; // Restaura todos
    } else {
      // Filtrar por el responsable seleccionado
      const result = this.originalData.items.filter(
        (resp: any) => resp.assigneeId == this.assignee
      );
      this.data.items = [...result]; // Crea una nueva referencia
    }
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
          this.onLoadData(this.status);
        }
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
  onProgram(id: string) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageProgramComponent,
        { id: id, ticketGroupId: this.ticketGroupId },
        'Programar actividad',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onReopen(id: string) {
    this.dialogHandlerService
      .openDialog(
        TicketMessageReopenComponent,
        { id: id },
        'Refutar ticket',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
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
        if (result) this.onLoadData(this.status);
      });
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
        const urlApi = `TicketMessage/InProgress/${id}/${this.authService.applicationUserId}`;

        this.apiRequestService.onGetItem(urlApi).then((result: any) => {
          // Actualizamos el valor del signal con los datos recibidos
          this.onLoadData(this.status);
        });
      }
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
        if (result) this.onLoadData(this.status);
      });
  }

  onUpdatePriority(id: string) {
    console.log(
      '🚀 ~ this.authService.applicationUserId:',
      this.authService.applicationUserId
    );
    const urlApi = `TicketMessage/UpdatePriority/${id}/${this.authService.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      if (result) {
        // Encuentra el índice del ítem con el ID proporcionado
        const itemIndex = this.data.items.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          // Cambia la prioridad del ítem
          const currentPriority = this.data.items[itemIndex].priority;

          // Alterna entre 'alta' y 'baja'
          this.data.items[itemIndex].priority =
            currentPriority === 'Alta' ? 'Baja' : 'Alta';
        }
      }
    });
  }

  calculateDaysDifference(item: {
    createdAtDate: string;
    closedAtDate?: string;
  }): number {
    // Convertir las fechas en objetos Date
    const createdAt = new Date(item.createdAtDate);
    const closedAt = item.closedAtDate
      ? new Date(item.closedAtDate)
      : new Date(); // Si closedAtDate no existe, usar la fecha de hoy

    // Calcular la diferencia en milisegundos
    const diffInMs = closedAt.getTime() - createdAt.getTime();

    // Convertir la diferencia de milisegundos a días
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  }
}
