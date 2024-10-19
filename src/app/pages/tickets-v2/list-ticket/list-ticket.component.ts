import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { onWeekChange } from 'src/app/core/helpers/dateUtils';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CardEmployeeComponent from 'src/app/pages/6.1-directorios/employee/card-employee/card-employee.component';
import { environment } from 'src/environments/environment';
import AddoreditTicketComponent from '../addoredit-ticket/addoredit-ticket.component';
import EnviarMailReporteSemanalComponent from '../enviar-mail-reporte-semanal/enviar-mail-reporte-semanal.component';
import TicketSeguimientoComponent from '../ticket-seguimiento/ticket-seguimiento.component';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, RouterModule, CommonModule],
})
export default class ListTicketComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  router = inject(Router);
  customToastService = inject(CustomToastService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  originalData: any[] = [];
  ref: DynamicDialogRef;
  urlAccount = environment.url_account;
  base_urlImg = '';
  status: any = 0;
  departament: any = 3;
  cb_departments: ISelectItem[] = [];
  responsible: string = '';
  cb_responsible: ISelectItem[] = [];
  week = '';
  weekReport = '';

  ngOnInit(): void {
    this.onLoadDepartamentList();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onPathReport(): string {
    return `${
      environment.base_urlImg
    }customers/${this.customerIdService.getCustomerId()}/report/`;
  }
  onStatusChange(event: any) {
    this.status = event.target.value;
    this.onLoadData();
  }

  onDepartmentChange(event: any) {
    this.departament = event.target.value;
    this.onLoadData();
  }
  onResponsibleChange(event: any) {
    this.responsible = event.target.value;
    const result = this.originalData.filter(
      (resp: any) => resp.applicationUserResponsableId == this.responsible
    );
    this.data = result;
  }

  onLoadDepartamentList() {
    this.cb_departments = [
      { label: 'Administración', value: 0 },
      { label: 'Mantenimiento', value: 3 },
      { label: 'Limpieza', value: 4 },
      { label: 'Jardineria', value: 6 },
      { label: 'Sistemas', value: 7 },
      { label: 'Operaciones', value: 5 },
      { label: 'Constructora', value: 9 },
    ];
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditTicketComponent,
        { id: data.id, departament: this.departament, status: data.status },
        data.title,
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalSeguimiento(id: number) {
    this.dialogHandlerService
      .openDialog(
        TicketSeguimientoComponent,
        { id },
        'Seguimientos',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCreatePathImg(): string {
    return `${
      environment.base_urlImg
    }customers/${this.customerIdService.getCustomerId()}/report/`;
  }

  onLoadData() {
    this.base_urlImg = this.onCreatePathImg();
    this.data = [];
    this.originalData = [];
    const urlApi = `Tickets/List/${this.customerIdService.customerId}/${this.status}/${this.departament}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.originalData = [...result]; // Guardar la lista original
      // Extraer los pares únicos de responsibleName y applicationUserResponsableId
      const uniqueResponsibles = Array.from(
        new Map(
          this.originalData.map((item) => [
            item.applicationUserResponsableId,
            item,
          ])
        ).values()
      );

      // Crear la lista para el select
      this.cb_responsible = uniqueResponsibles.map((item) => ({
        value: item.applicationUserResponsableId,
        label: item.responsibleName,
      }));
    });
  }
  pathReport = '';

  // Método para manejar el cambio de semana en el input
  handleWeekChange(event: Event): void {
    const data = this.originalData;
    onWeekChange(event, data, 'fechaProgamacion', (filteredData) => {
      this.data = filteredData;
      // Aquí puedes agregar cualquier lógica adicional que necesites después de filtrar los datos
    });

    if (this.weekReport !== '') {
      // Obtener solo el año de la cadena '2024-W03'
      const year = this.weekReport.split('-W')[0];

      // Obtener solo el número de semana de la cadena '2024-W03'
      const numeroSemana = +this.weekReport.split('-W')[1];
      const urlApi = `Tickets/PathReport/${this.customerIdService.customerId}/${year}/${numeroSemana}`;
      this.apiRequestService.onGetItem(urlApi).then((result: any) => {
        this.pathReport = result.pathReport;
      });
    }
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Tarjeta de Usuario',
      this.dialogHandlerService.dialogSizeSm
    );
  }
  onUpdateStateTicket(item: any) {
    const urlApi = `Tickets/ActualizarStateEnviarReporte/${item.id}/${item.folioReporte}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.customToastService.onCloseToSuccess();
    });
  }

  // Method logic for sending work plan
  onSendWorkPlan(week: string) {
    // Obtener solo el año de la cadena '2024-W03'
    const year = week.split('-W')[0];

    // Obtener solo el número de semana de la cadena '2024-W03'
    const numeroSemana = +week.split('-W')[1];

    const urlApi = `WeeklyWorkPlan/Create/${numeroSemana}/${year}/${this.customerIdService.customerId}/${this.authService.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.customToastService.onCloseToSuccess();
    });
  }

  onSendReport(week: string) {
    // Obtener solo el año de la cadena '2024-W03'
    const year = week.split('-W')[0];

    // Obtener solo el número de semana de la cadena '2024-W03'
    const numeroSemana = +week.split('-W')[1];
    this.dialogHandlerService
      .openDialog(
        EnviarMailReporteSemanalComponent,
        { numeroSemana, year },
        'Enviar reporte semanal',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        this.customToastService.onShowSuccess();
      });
  }
  onLoadMisTickets() {
    const result = this.originalData.filter(
      (resp: any) =>
        resp.applicationUserResponsableId == this.authService.applicationUserId
    );
    this.data = result;
  }

  onLoadTicketsAll() {
    this.data = [...this.originalData]; // Restaurar la lista original de tickets
    this.week = '';
    this.weekReport = '';
    this.responsible = '';
  }
  onDelete(item: any) {
    this.apiRequestService
      .onDelete(`Tickets/${item.id}`)
      .then((result: boolean) => {
        if (result) {
          // Filtrar eliminando el item que coincide con el id
          this.data = this.data.filter((i) => i.id !== item.id);
        }
      });
  }
}
