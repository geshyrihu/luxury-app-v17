import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddorEditMeetingSeguimientoComponent from '../../juntas-comite/junta-comite-minutas/addor-edit-meeting-seguimiento.component';

@Component({
  selector: 'app-cont-minuta-seguimientos',
  templateUrl: './cont-minuta-seguimientos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ContMinutaSeguimientosComponent implements OnInit {
  config = inject(DynamicDialogConfig);

  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  data: any[] = [];
  id = this.config.data.idItem;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.apiRequestS
      .onGetList(`ContabilidadMinuta/ListaSeguimientos/${this.id}`)
      .then((result: any) => {
        this.data = result;
      });
  }

  onDeleteSeguimiento(id: number) {
    this.apiRequestS
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  onModalAddOrEditSeguimiento(idMeetingSeguimiento: any) {
    this.dialogHandlerS
      .openDialog(
        AddorEditMeetingSeguimientoComponent,
        {
          idMeetingSeguimiento,
        },
        'Seguimiento',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
