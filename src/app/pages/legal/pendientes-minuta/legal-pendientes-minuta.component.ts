import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import AddoreditMinutaDetalleComponent from 'src/app/pages/operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';

import ContMinutaSeguimientosComponent from '../../contabilidad/contabilidad-pendientes-minuta/cont-minuta-seguimientos.component';
@Component({
  selector: 'app-legal-pendientes-minuta',
  templateUrl: './legal-pendientes-minuta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalPendientesMinutaComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  customToastService = inject(CustomToastService);

  data: any[] = [];

  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ContabilidadMinuta/ListaMinutaLegal/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
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
        this.onLoadData();
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
        this.onLoadData();
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
          this.onLoadData();
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
      this.onLoadData();
    });
  }
  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
  }
}
