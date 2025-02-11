import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import Swal from 'sweetalert2';

// Component imports
import CardEmployeeComponent from '../../../directorios/employee-internal/card-employee.component';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';
import { TicketResult } from '../../interfaces/ticket-message-list';
import SendOperationReportComponent from '../../send-operation-report/send-operation-report.component';
import { TicketMessageModule } from '../../ticket-message.module';
import { TicketGroupService } from '../../ticket.service';
import TicketMessageAddOrEditComponent from '../ticket-message-add-or-edit/ticket-message-add-or-edit.component';
import TicketMessageCloseComponent from '../ticket-message-close/ticket-message-close.component';
import TicketMessageProgramComponent from '../ticket-message-program/ticket-message-program.component';
import TicketMessageReadListComponent from '../ticket-message-read-list/ticket-message-read-list.component';
import TicketMessageReopenComponent from '../ticket-message-reopen/ticket-message-reopen.component';

@Component({
    selector: 'app-ticket-message-list',
    templateUrl: './ticket-message-list.component.html',
    imports: [LuxuryAppComponentsModule, TicketMessageModule]
})
export default class TicketMessageListComponent implements OnInit {
  // Dependencies injection
  activatedRoute = inject(ActivatedRoute);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  ticketGroupService = inject(TicketGroupService);

  // User and Data Setup
  applicationUser = this.authS.applicationUserId;
  isSuperUser = this.authS.onValidateRoles(['SuperUsuario']);
  ticketGroupId: string = this.activatedRoute.snapshot.params.ticketGroupId;

  // Pagination Setup
  rows = 30; // Cantidad de registros por página
  first = 0;
  totalRecords = 0;
  page: number = 1;
  pageSize: number = 30;
  searchTerm: string = '';

  // Data Structures
  data: TicketResult = {
    nameGroup: '',
    assignee: null,
    totalRecords: 30,
    items: [],
  };
  originalData: TicketResult = {
    nameGroup: '',
    assignee: null,
    totalRecords: 30,
    items: [],
  };
  assignee: string = null;
  cb_assignee: ISelectItem[] = [];
  status: string = this.ticketGroupService.ticketGroupMessageStatus;

  // Week Info
  year: number = this.ticketGroupService.year || 0;
  numeroSemana: number = this.ticketGroupService.numeroSemana || 0;
  weekInputValue: string = '';
  wekklyIsNullOrEmpty = true;

  // Lifecycle Hook: on component initialization
  ngOnInit(): void {
    this.initializeWeekInfo();
    this.onLoadData(
      this.ticketGroupService.ticketGroupMessageStatus,
      this.page,
      this.pageSize
    );
  }
  // Initialize week data based on year and week number
  initializeWeekInfo(): void {
    if (this.year === 0 || this.numeroSemana === 0) {
      this.wekklyIsNullOrEmpty = true;
    } else {
      this.wekklyIsNullOrEmpty = false;
      const startOfWeek = this.getStartOfWeek(this.year, this.numeroSemana);
      this.weekInputValue = `${startOfWeek.getFullYear()}-W${
        this.numeroSemana < 10 ? '0' : ''
      }${this.numeroSemana}`;
    }
  }

  applyFilter() {
    this.onLoadDataOffLoading(
      this.status,
      this.page,
      this.pageSize,
      this.searchTerm
    );
  }

  getStartOfWeek(year: number, weekNumber: number): Date {
    const januaryFirst = new Date(year, 0, 1);
    const daysToAdd = (weekNumber - 1) * 7 - (januaryFirst.getDay() || 7) + 1; // Ajustar para que inicie el lunes
    return new Date(year, 0, 1 + daysToAdd);
  }

  loadDataLazy(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;

    this.loadDataFromApi();
  }

  loadDataFromApi() {
    this.onLoadData(this.status, this.page, this.pageSize);
  }

  onLoadDataOffLoading(
    status: any,
    page: number = this.page,
    pageSize: number = this.pageSize,
    filter: string = ''
  ) {
    this.status = status;
    const urlApi = `Tickets/List/${this.ticketGroupId}/${status}`;
    const httpParams = { page, pageSize, filter };

    this.apiRequestS
      .onGetListOffLoading(urlApi, httpParams)
      .then((responseData: TicketResult) => {
        if (!responseData) return;

        this.data = responseData;
        this.cb_assignee = responseData.assignee;
        this.totalRecords = responseData.totalRecords;
        // Guardamos una copia de los datos originales para futuras referencias
        this.originalData = JSON.parse(JSON.stringify(responseData));
      });
  }
  onLoadData(
    status: any,
    page: number = this.page,
    pageSize: number = this.pageSize,
    filter: string = ''
  ) {
    this.status = status;
    const urlApi = `Tickets/List/${this.ticketGroupId}/${status}`;
    const httpParams = { page, pageSize, filter };

    this.apiRequestS
      .onGetList(urlApi, httpParams)
      .then((responseData: TicketResult) => {
        if (!responseData) return;

        this.data = responseData;
        this.totalRecords = responseData.totalRecords;
        this.cb_assignee = responseData.assignee;
        // Guardamos una copia de los datos originales para futuras referencias
        this.originalData = JSON.parse(JSON.stringify(responseData));
      });
  }

  // onResponsibleChange(event: any) {
  //   if (event.target.value === 'null') {
  //     // Mostrar todos los elementos
  //     this.data.items = [...this.data.items]; // Restaura todos
  //   } else {
  //     // Filtrar por el responsable seleccionado
  //     const result = this.data.items.filter(
  //       (resp: any) => resp.assigneeId == this.assignee
  //     );
  //     this.data.items = [...result]; // Crea una nueva referencia
  //   }
  // }

  onResponsibleChange(event: any) {
    if (!this.originalData || !this.originalData.items) {
      console.error('No hay datos originales para restaurar.');
      return;
    }

    if (event.target.value === 'null') {
      // Mostrar todos los elementos restaurando los datos originales
      this.data.items = [...this.originalData.items];
    } else {
      // Filtrar por el responsable seleccionado
      const result = this.originalData.items.filter(
        (resp: any) => resp.assigneeId == event.target.value
      );
      this.data.items = [...result]; // Crea una nueva referencia
    }
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageAddOrEditComponent,
        { id: data.id, ticketGroupId: this.ticketGroupId },
        data.title,
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        this.onLoadData(this.status);
        if (responseData) {
        }
      });
  }
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerS.dialogSizeMd
    );
  }
  onProgram(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageProgramComponent,
        { id: id, ticketGroupId: this.ticketGroupId },
        'Programar actividad',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.status);
      });
  }
  onReopen(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageReopenComponent,
        { id: id },
        'Re abrir ticket',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.status);
      });
  }
  onView(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageReadListComponent,
        { id: id },
        'Vistas',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.status);
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
    }).then((responseData) => {
      if (responseData.value) {
        const urlApi = `Tickets/InProgress/${id}/${this.authS.applicationUserId}`;

        this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
          // Actualizamos el valor del signal con los datos recibidos
          this.onLoadData(this.status);
        });
      }
    });
  }

  onNavigateEdit(id, applicationUser, ticketGroupId) {
    this.router.navigate([
      '/tickets/message/',
      id,
      applicationUser,
      ticketGroupId,
    ]);
  }
  onClosed(id: string) {
    this.dialogHandlerS
      .openDialog(
        TicketMessageCloseComponent,
        { id: id },
        'Cerrar ticket',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.status);
      });
  }

  // Actualizar si el item es relevante o no
  onUpdateStateTicket(item: any) {
    const urlApi = `Tickets/UpdateRelevance/${item.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
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
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.status);
      });
  }

  onUpdatePriority(id: string) {
    const urlApi = `Tickets/UpdatePriority/${id}/${this.authS.applicationUserId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      if (responseData) {
        // Encuentra el índice del ítem con el ID proporcionado
        const itemIndex = this.data.items.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          // Cambia la prioridad del ítem
          const currentPriority = this.data.items[itemIndex].priority;

          // Alterna entre 'alta' y 'baja'
          this.data.items[itemIndex].priority =
            currentPriority === 'High' ? 'Low' : 'High';
        }
      }
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: any) {
    this.apiRequestS
      .onDelete(`Tickets/${id}/${this.customerIdS.getCustomerId()}`)
      .then((responseData: boolean) => {
        // Actualizamos el signal para eliminar el elemento de la lista
        if (responseData) {
          // Filtrar y actualizar los datos actuales
          this.data.items = this.data.items.filter((item) => item.id !== id);

          // También filtramos la lista original si es necesario
          this.data.items = this.data.items.filter((item) => item.id !== id);
        }
      });
  }

  handleWeekChange(event: Event): void {
    const weekValue = (event.target as HTMLInputElement).value; // '2024-W43'

    if (weekValue) {
      this.year = parseInt(weekValue.split('-W')[0], 10); // Año 2024
      this.numeroSemana = parseInt(weekValue.split('-W')[1], 10); // Semana 43
      this.wekklyIsNullOrEmpty = false;

      // Enviar el año y el número de semana al backend
      this.ticketGroupService.year = this.year;
      this.ticketGroupService.numeroSemana = this.numeroSemana;
      this.wekklyIsNullOrEmpty = false;
    }
  }
  onPreviewWeeklyReport(): void {
    // Lógica para la vista previa
    this.router.navigate(['/tickets/weekly-report-preview']);
  }
  onSendWeeklyReport(): void {
    // Lógica para enviar el reporte
    this.dialogHandlerS
      .openDialog(
        SendOperationReportComponent,
        {
          year: this.year,
          numeroSemana: this.numeroSemana,
        },
        'Envio de reporte semanal',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.status);
      });
  }
  onPreviewClickedWorkPlan(): void {
    // Lógica para la vista previa
    this.router.navigate(['/tickets/work-plan-preview']);
  }
}
