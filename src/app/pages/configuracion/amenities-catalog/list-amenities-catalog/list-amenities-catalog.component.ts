import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditAmenitiesCatalogComponent from '../add-or-edit-amenities-catalog/add-or-edit-amenities-catalog.component';

@Component({
  selector: 'app-list-amenities-catalog',
  templateUrl: './list-amenities-catalog.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListAmenitiesCatalogComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    const urlApi = `amenitiescatalog`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`amenitiescatalog/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditAmenitiesCatalogComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
