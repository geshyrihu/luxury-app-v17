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
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList('CalendarioMaestroEquipo')
      .then((responseData: any) => {
        this.data = responseData;
      });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`CalendarioMaestroEquipo/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditCalendarioMaestroEquipoComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeSm
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
