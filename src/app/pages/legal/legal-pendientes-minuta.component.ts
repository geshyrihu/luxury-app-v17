import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ContMinutaSeguimientosComponent from '../contabilidad/contabilidad-pendientes-minuta/cont-minuta-seguimientos.component';
import AddorEditMeetingSeguimientoComponent from '../juntas-comite/junta-comite-minutas/addor-edit-meeting-seguimiento.component';
import AddoreditMinutaDetalleComponent from '../juntas-comite/junta-comite-minutas/addoredit-minuta-detalle.component';

@Component({
    selector: 'app-legal-pendientes-minuta',
    templateUrl: './legal-pendientes-minuta.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class LegalPendientesMinutaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;
  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        `ContabilidadMinuta/ListaMinutaLegal/${this.authS.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
      )
      .then((responseData: any) => {
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
        'Agregar Seguimiento',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
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
        data.header,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestS
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerS.openDialog(
      ContMinutaSeguimientosComponent,
      {
        idItem,
      },
      'Seguimientos',
      this.dialogHandlerS.dialogSizeMd
    );
  }
  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
  }
}
