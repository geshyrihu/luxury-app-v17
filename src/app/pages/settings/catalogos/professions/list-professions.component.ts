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
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListProfessionsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  authS = inject(AuthService);
  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = 'Professions/';
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    const urlApi = `Professions/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditProfessionsComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalDescripcionPuestos(data: any) {
    this.dialogHandlerService.openDialog(
      DescripcionPuestoComponent,
      data,
      data.title,
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
