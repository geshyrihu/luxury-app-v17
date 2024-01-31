import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IFilterTicket } from 'src/app/core/interfaces/IFilterTicket.interface';
import {
  AuthService,
  CustomerIdService,
  CustomToastService,
  DataService,
  DateService,
  ReportService,
  TicketFilterService,
} from 'src/app/core/services/common-services';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import EnviarMailReporteSemanalComponent from '../../enviar-email/enviar-mail-reporte-semanal/enviar-mail-reporte-semanal.component';
import AddoreditTicketComponent from '../addoredit-ticket/addoredit-ticket.component';
import FilterWorkplanComponent from '../filter-workplan/filter-workplan.component';
import SendWorkPlanComponent from '../send-work-plan/send-work-plan.component';
import TicketSeguimientoComponent from '../ticket-comentario/ticket-seguimiento.component';
import FilterTicketComponent from '../ticket-filter/ticket-filter.component';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    RouterModule,
    CommonModule,
    LuxuryAppComponentsModule,
    FormsModule,
    PrimeNgModule,
  ],
  providers: [ConfirmationService],
})
export default class ListTicketComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ticketFilterService = inject(TicketFilterService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);

  base_urlImg = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  dataCompleta: any[] = [];
  filterTicket: IFilterTicket;
  ligaReporte: string = '';
  ref: DynamicDialogRef;
  url = `${environment.base_urlImg}Administration/accounts/`;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.setDataFilter();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.ticketFilterService.setIdCustomer(this.customerIdService.customerId);
      this.onLoadData();
    });
  }

  setDataFilter() {
    return this.ticketFilterService.getfilterTicket;
  }

  onLoadData() {
    this.onCreateLiga();
    this.base_urlImg = `${
      environment.base_urlImg
    }customers/${this.ticketFilterService.getIdCustomer()}/report/`;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post<IFilterTicket>('Ticket', this.ticketFilterService.getfilterTicket)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.dataCompleta = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditTicketComponent, {
      data: {
        id: data.id,
        status: data.status,
        customerId: this.customerIdService.customerId,
      },
      header: data.title,
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalComentarios(id: number) {
    this.ref = this.dialogService.open(TicketSeguimientoComponent, {
      data: {
        id,
      },
      header: 'Seguimientos',
      width: '60%',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalEnviarEmail() {
    this.ref = this.dialogService.open(EnviarMailReporteSemanalComponent, {
      data: {
        customerId: this.customerIdService.customerId,
        fechaInicial: this.dateService.getDateFormat(
          this.ticketFilterService.filterTicket.finishedStart
        ),
        fechaFinal: this.dateService.getDateFormat(
          this.ticketFilterService.filterTicket.finishedEnd
        ),
      },
      header: 'Enviar reporte semanal',
      styleClass: 'modal-lg',
      baseZIndex: 1000,
      height: '100%',
      width: '100%',
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalFiltro() {
    this.ref = this.dialogService.open(FilterTicketComponent, {
      data: {
        panelDto: this.filterTicket,
      },
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      dismissableMask: true,
      closeOnEscape: true,
      rtl: true,
      showHeader: false,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalWorkPlan() {
    this.ref = this.dialogService.open(FilterWorkplanComponent, {
      data: {
        panelDto: this.filterTicket,
      },
      styleClass: 'modal-sm',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: any) => {
      if (resp.fechaInicial && resp.fechaFinal) {
        this.dataService
          .get(
            `Ticket/FilterWorkPlan/${this.customerIdService.getcustomerId()}/${this.dateService.getDateFormat(
              resp.fechaInicial
            )}/${this.dateService.getDateFormat(resp.fechaFinal)}`
          )
          .subscribe({
            next: (resp: any) => {
              this.data = this.customToastService.onCloseOnGetData(resp.body);
            },
            error: (error) => {
              this.customToastService.onCloseToError(error);
            },
          });
      }
    });
  }
  onModalSendWorkPlan() {
    this.ref = this.dialogService.open(SendWorkPlanComponent, {
      data: {
        panelDto: this.filterTicket,
      },
      styleClass: 'modal-sm',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }

  onDelete(item: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(
        `Ticket/onDelete/${item.id}/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onGeneratePDF() {
    this.reportService.setCustomerId(this.customerIdService.customerId);
    this.reportService.setDataOperationReport(this.filterTicket);
    this.router.navigateByUrl('report/operationReport');
  }
  onGeneratePDFPending() {
    this.reportService.setCustomerId(this.customerIdService.customerId);
    this.reportService.setDataOperationReport(this.filterTicket);
    this.router.navigateByUrl('report/operationPendientesReport');
  }

  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Tarjeta de Usuario',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onUpdateStateTicket(item: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Ticket/ActualizarStateEnviarReporte/${item.id}/${item.folioReporte}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSendProviders() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`ticket/sendproviders/`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onCreateLiga() {
    if (
      this.ticketFilterService.filterTicket.finishedStart &&
      this.ticketFilterService.filterTicket.finishedEnd
    ) {
      const liga =
        'http://luxurybuildingapp.com:1008/#/publico/reporte-operacion/' +
        this.customerIdService.getcustomerId() +
        '/' +
        this.dateService.getDateFormat(
          this.ticketFilterService.filterTicket.finishedStart
        ) +
        '/' +
        this.dateService.getDateFormat(
          this.ticketFilterService.filterTicket.finishedEnd
        );
      this.ligaReporte = liga;
    }
  }

  onLoadMisTickets() {
    const result = this.data.filter(
      (resp: any) =>
        resp.responsableId ==
        this.authService.userTokenDto.infoEmployeeDto.employeeId
    );
    this.data = result;
  }

  onLoadTicketsAll() {
    this.data = this.dataCompleta;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
