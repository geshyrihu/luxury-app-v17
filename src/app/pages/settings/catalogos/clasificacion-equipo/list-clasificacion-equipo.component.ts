import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditClasificacionEquipoComponent from './addoredit-clasificacion-equipo.component';

@Component({
    selector: 'app-list-clasificacion-equipo',
    templateUrl: './list-clasificacion-equipo.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListClasificacionEquipoComponent implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS
      .onGetList('EquipoClasificacion')
      .then((responseData: any) => {
        this.data = responseData;
      });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`equipoclasificacion/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditClasificacionEquipoComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
