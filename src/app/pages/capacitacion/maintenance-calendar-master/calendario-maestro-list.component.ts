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
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList('calendariomaestro/getall')
      .then((result: any) => {
        this.data = result;
      });
  }

  onDatosServicio(data: any) {
    this.dialogHandlerS.openDialog(
      DatosServicioAddOrEditComponent,
      data,
      'Información de servicio',
      this.dialogHandlerS.dialogSizeLg
    );
  }
  onDelete(id: number): any {
    this.apiRequestS
      .onDelete(`calendariomaestro/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(id: number, mes: number) {
    this.dialogHandlerS
      .openDialog(
        CalendarioMaestroAddOrEditComponent,
        {
          id,
          mes,
        },
        'Calendario Maestro',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
