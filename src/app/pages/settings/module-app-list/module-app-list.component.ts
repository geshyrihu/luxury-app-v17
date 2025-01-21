import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ModuleAppAddOrEditComponent } from './module-app-add-or-edit.component';

@Component({
  selector: 'app-module-app-list',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './module-app-list.component.html',
})
export default class ModuleAppListComponent {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ModuleApp`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService.onDelete(`ModuleApp/${id}`).then((_) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.data.filter((item) => item.id !== id);
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        ModuleAppAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onRowReorder(event: any) {
    // Paso 4: Actualizar los índices de todos los elementos
    this.data.forEach((item, index) => {
      item.positionIndex = index + 1; // Los índices empiezan desde 1
    });

    // Llamar al servicio para actualizar los índices en el backend (si es necesario)
    this.updateModuleIndices(this.data);
  }

  updateModuleIndices(data: any[]) {
    // Crear un arreglo con los nuevos índices y otros datos necesarios
    const updatedModules = data.map((item) => ({
      Id: item.id,
      PositionIndex: item.positionIndex,
    }));
    // Llamar a la API para actualizar el índice en el backend
    const urlApi = 'ModuleApp/UpdatePositionIndex'; // La ruta del endpoint en tu API
    this.apiRequestService.onPost(urlApi, updatedModules);
  }
}
