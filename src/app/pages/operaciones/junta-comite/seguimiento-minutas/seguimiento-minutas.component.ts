import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ContMinutaSeguimientosComponent from 'src/app/pages/contabilidad/contabilidad-pendientes-minuta/cont-minuta-seguimientos.component';
import AddoreditMinutaDetalleComponent from 'src/app/pages/operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';

@Component({
  selector: 'app-seguimiento-minutas',
  templateUrl: './seguimiento-minutas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SeguimientoMinutaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  ref: DynamicDialogRef;

  statusFiltro: number = 0;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData(this.statusFiltro);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.statusFiltro);
    });
  }

  onLoadData(filtro: number) {
    const urlApi = `Meetings/SeguimientoMinutas/${this.customerIdService.customerId}/${filtro}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.dialogHandlerService
      .openDialog(
        AddorEditMeetingSeguimientoComponent,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        'Seguimiento',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.statusFiltro);
      });
  }

  onModalAddOrEditMinutaDetalle(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditMinutaDetalleComponent,
        {
          id: data.id,
          areaResponsable: data.areaResponsable,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.statusFiltro);
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestService
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((result: boolean) => {
        this.onLoadData(this.statusFiltro);
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerService
      .openDialog(
        ContMinutaSeguimientosComponent,
        {
          idItem,
        },
        'Seguimientos',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.statusFiltro);
      });
  }
  onFiltrarData(filtro: number) {
    this.statusFiltro = filtro;
    this.onLoadData(filtro);
  }
}
