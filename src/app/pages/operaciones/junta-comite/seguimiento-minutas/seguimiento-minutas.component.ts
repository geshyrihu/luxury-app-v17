import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomerIdService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ContMinutaSeguimientosComponent from 'src/app/pages/contabilidad/contabilidad-pendientes-minuta/cont-minuta-seguimientos.component';
import AddoreditMinutaDetalleComponent from 'src/app/pages/operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';

@Component({
  selector: 'app-seguimiento-minutas',
  templateUrl: './seguimiento-minutas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SeguimientoMinutaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);

  data: any[] = [];

  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  statusFiltro: number = 0;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData(this.statusFiltro);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.statusFiltro);
    });
  }

  onLoadData(filtro: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Meetings/SeguimientoMinutas/${this.customerIdService.customerId}/${filtro}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.ref = this.dialogService.open(AddorEditMeetingSeguimientoComponent, {
      data: {
        meetingDetailsId,
        idMeetingSeguimiento,
      },
      header: 'Seguimiento',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.statusFiltro);
      }
    });
  }

  onModalAddOrEditMinutaDetalle(data: any) {
    this.ref = this.dialogService.open(AddoreditMinutaDetalleComponent, {
      data: {
        id: data.id,
        areaResponsable: data.areaResponsable,
      },
      header: data.header,
      styleClass: 'modal-md',
      closeOnEscape: true,
      autoZIndex: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.statusFiltro);
      }
    });
  }

  onDeleteSeguimiento(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`MeetingDertailsSeguimiento/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData(this.statusFiltro);
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  onModalTodosSeguimientos(idItem: number) {
    this.ref = this.dialogService.open(ContMinutaSeguimientosComponent, {
      data: {
        idItem,
      },
      header: 'Seguimientos',
      width: '80%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe(() => {
      this.onLoadData(this.statusFiltro);
    });
  }
  onFiltrarData(filtro: number) {
    this.statusFiltro = filtro;
    this.onLoadData(filtro);
  }
}
