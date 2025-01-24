import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CalendarioMaestroAddOrEditComponent from './calendario-maestro-addoredit.component';
import DatosServicioAddOrEditComponent from './datos-servicio-addoredit.component';

@Component({
  selector: 'app-calendario-maestro-list',
  templateUrl: './calendario-maestro-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CalendarioMaestroListComponent implements OnInit {
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
      DatosServicioAddOrEditComponent,
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
        CalendarioMaestroAddOrEditComponent,
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
