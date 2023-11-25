import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  FiltroCalendarService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import DashboardMinutasResumenComponent from '../dashboard-minutas-resumen/dashboard-minutas-resumen.component';

@Component({
  selector: 'app-dashboard-minutas',
  templateUrl: './dashboard-minutas.component.html',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ComponentsModule,
    NgbAlertModule,
    ToastModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class DashboardMinutasComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  private customerIdService = inject(CustomerIdService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  constructor() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
  }

  ngOnInit(): void {
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
    this.onLoadData();
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData();
    });
  }

  onSendEmailAllPendingMeeting() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`Meetings/SendEmailAllPendingMeeting`)
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/MinutasPendientes/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModalAddOrEditMinutaDetalle(eAreaMinutasDetalles: number) {
    let titulo: string = '';

    if (eAreaMinutasDetalles == 0) {
      titulo = 'Contable';
    }
    if (eAreaMinutasDetalles == 1) {
      titulo = 'Operaciones';
    }
    if (eAreaMinutasDetalles == 2) {
      titulo = 'Legal';
    }
    this.ref = this.dialogService.open(DashboardMinutasResumenComponent, {
      data: {
        eAreaMinutasDetalles,
      },
      header: 'Pendientes ' + titulo,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      autoZIndex: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
