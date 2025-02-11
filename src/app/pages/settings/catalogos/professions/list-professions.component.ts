import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditProfessionsComponent from './addoredit-professions.component';
import DescripcionPuestoComponent from './descripcion-puesto.component';

@Component({
    selector: 'app-professions',
    templateUrl: './list-professions.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListProfessionsComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  authS = inject(AuthService);
  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = 'Professions/';
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDelete(id: number) {
    const urlApi = `Professions/${id}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: boolean) => {
      if (responseData) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditProfessionsComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onModalDescripcionPuestos(data: any) {
    this.dialogHandlerS.openDialog(
      DescripcionPuestoComponent,
      data,
      data.title,
      this.dialogHandlerS.dialogSizeFull
    );
  }
}
