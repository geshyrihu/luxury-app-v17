import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditMinutaDetalleComponent from 'src/app/pages/5.1-operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/5.1-operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';
import ContMinutaSeguimientosComponent from '../../2-contabilidad/contabilidad-pendientes-minuta/cont-minuta-seguimientos.component';
@Component({
  selector: 'app-legal-pendientes-minuta',
  templateUrl: './legal-pendientes-minuta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalPendientesMinutaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;
  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `ContabilidadMinuta/ListaMinutaLegal/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
      )
      .then((result: any) => {
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
        'Agregar Seguimiento',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
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
        data.header,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestService
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.dialogHandlerService.openDialog(
      ContMinutaSeguimientosComponent,
      {
        idItem,
      },
      'Seguimientos',
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
  }
}
