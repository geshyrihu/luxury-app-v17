import { Component, inject, signal } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import CatalogAssetAddoreditComponent from '../catalog-asset-addoredit/catalog-asset-addoredit.component';

@Component({
    selector: 'app-catalog-asset-list',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    templateUrl: './catalog-asset-list.component.html'
})
export default class CatalogAssetListComponent {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `CatalogAsset`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(responseData);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`CatalogAsset/${id}`)
      .then((responseData: any) => {
        // Actualizamos el signal para eliminar el elemento de la lista
        this.dataSignal.set(
          this.dataSignal().filter((item: any) => item.id !== id)
        );
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        CatalogAssetAddoreditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}

export interface CatalogAsset {
  id: string;
  folio: string;
  name: string;
  assetCategory: EAssetCategory;
}
export enum EAssetCategory {
  Equipo,
  Amenidades,
  Mobiliario,
  ÁreasComunes,
  Gimnasio,
  Sistemas,
  'Almacenes, cuartos y bodegas',
}
export interface CatalogAssetAddOrEdit {
  folio: string;
  name: string;
  assetCategory: EAssetCategory;
}
