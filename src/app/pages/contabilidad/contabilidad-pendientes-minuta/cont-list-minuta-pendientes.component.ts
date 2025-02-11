import { Component, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddorEditMeetingSeguimientoComponent from '../../juntas-comite/junta-comite-minutas/addor-edit-meeting-seguimiento.component';
import AddoreditMinutaDetalleComponent from '../../juntas-comite/junta-comite-minutas/addoredit-minuta-detalle.component';
import ContMinutaSeguimientosComponent from './cont-minuta-seguimientos.component';

@Component({
  selector: 'app-cont-list-minuta-pendientes',
  templateUrl: './cont-list-minuta-pendientes.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbTooltip],
})
export default class ContListMinutaPendientesComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  dialogS = inject(DialogService);
  messageS = inject(MessageService);

  data: any[] = [];
  ref: DynamicDialogRef;
  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        `ContabilidadMinuta/ListaMinuta/${this.authS.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }

  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
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
      .then((result: boolean) => {
        if (result) this.onLoadData();
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
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalAddOrEditMinutaDetalle(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditMinutaDetalleComponent,
        data,
        data.header,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
