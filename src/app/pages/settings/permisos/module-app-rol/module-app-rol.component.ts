import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ModuleAppRolUpdateComponent from './module-app-rol-update.component';

@Component({
  selector: 'app-module-app-rol',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './module-app-rol.component.html',
})
export default class ModuleAppRolComponent {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ModuleAppRol/ListRole`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS.openDialog(
      ModuleAppRolUpdateComponent,
      data,
      data.title,
      this.dialogHandlerS.dialogSizeMd
    );
  }
}
