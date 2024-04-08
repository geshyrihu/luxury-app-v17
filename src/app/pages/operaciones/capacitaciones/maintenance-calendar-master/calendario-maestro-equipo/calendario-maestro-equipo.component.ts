import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditCalendarioMaestroEquipoComponent from './addoredit-calendario-maestro-equipo.component';

@Component({
  selector: 'app-calendario-maestro-equipo',
  templateUrl: './calendario-maestro-equipo.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CalendarioMaestroEquipoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList('CalendarioMaestroEquipo')
      .then((result: any) => {
        this.data = result;
      });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`CalendarioMaestroEquipo/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditCalendarioMaestroEquipoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeSm
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
