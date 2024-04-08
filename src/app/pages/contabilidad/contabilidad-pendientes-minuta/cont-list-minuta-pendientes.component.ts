import { Component, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import AddoreditMinutaDetalleComponent from 'src/app/pages/operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ContMinutaSeguimientosComponent from './cont-minuta-seguimientos.component';

@Component({
  selector: 'app-cont-list-minuta-pendientes',
  templateUrl: './cont-list-minuta-pendientes.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbTooltip],
})
export default class ContListMinutaPendientesComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);

  data: any[] = [];
  ref: DynamicDialogRef;
  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `ContabilidadMinuta/ListaMinuta/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
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
        if (result) this.onLoadData();
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
        if (result) this.onLoadData();
      });
  }

  onModalAddOrEditMinutaDetalle(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditMinutaDetalleComponent,
        data,
        data.header,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
