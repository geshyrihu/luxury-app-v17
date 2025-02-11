import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ContMinutaSeguimientosComponent from 'src/app/pages/contabilidad/contabilidad-pendientes-minuta/cont-minuta-seguimientos.component';
import AddorEditMeetingSeguimientoComponent from './addor-edit-meeting-seguimiento.component';
import AddoreditMinutaDetalleComponent from './addoredit-minuta-detalle.component';

@Component({
    selector: 'app-seguimiento-minutas',
    templateUrl: './seguimiento-minutas.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class SeguimientoMinutaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];
  ref: DynamicDialogRef;

  statusFiltro: number = 0;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit() {
    this.onLoadData(this.statusFiltro);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.statusFiltro);
    });
  }

  onLoadData(filtro: number) {
    const urlApi = `Meetings/SeguimientoMinutas/${this.customerIdS.customerId}/${filtro}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.dialogHandlerS
      .openDialog(
        AddorEditMeetingSeguimientoComponent,
        {
          meetingDetailsId,
          idMeetingSeguimiento,
        },
        'Seguimiento',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.statusFiltro);
      });
  }

  onModalAddOrEditMinutaDetalle(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditMinutaDetalleComponent,
        {
          id: data.id,
          areaResponsable: data.areaResponsable,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.statusFiltro);
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestS
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((responseData: boolean) => {
        this.onLoadData(this.statusFiltro);
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerS
      .openDialog(
        ContMinutaSeguimientosComponent,
        {
          idItem,
        },
        'Seguimientos',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData(this.statusFiltro);
      });
  }
  onFiltrarData(filtro: number) {
    this.statusFiltro = filtro;
    this.onLoadData(filtro);
  }
}
