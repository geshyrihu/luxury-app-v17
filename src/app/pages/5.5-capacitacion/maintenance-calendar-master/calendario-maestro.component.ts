import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditCalendarioMaestroComponent from './addoredit-calendario-maestro.component';
import ModalDatosServicioComponent from './modal-datos-servicio/modal-datos-servicio.component';

@Component({
  selector: 'app-calendario-maestro',
  templateUrl: './calendario-maestro.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CalendarioMaestroComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList('calendariomaestro/getall')
      .then((result: any) => {
        this.data = result;
      });
  }

  onDatosServicio(data: any) {
    this.dialogHandlerService.openDialog(
      ModalDatosServicioComponent,
      data,
      'Información de servicio',
      this.dialogHandlerService.dialogSizeLg
    );
  }
  onDelete(id: number): any {
    this.apiRequestService
      .onDelete(`calendariomaestro/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(id: number, mes: number) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditCalendarioMaestroComponent,
        {
          id,
          mes,
        },
        'Calendario Maestro',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
