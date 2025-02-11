import { Component, inject, signal } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { RolesAddOrEditComponent } from './roles-add-or-edit.component';

@Component({
    selector: 'app-roles',
    imports: [LuxuryAppComponentsModule],
    templateUrl: './roles-list.component.html'
})
export default class RolesListComponent {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Roles`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(responseData);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestS.onDelete(`Roles/${id}`).then((responseData: boolean) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.set(this.dataSignal().filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        RolesAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
