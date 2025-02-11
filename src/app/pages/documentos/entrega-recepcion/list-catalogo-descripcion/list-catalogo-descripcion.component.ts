import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditCatalogoDescripcionComponent from 'src/app/pages/settings/catalogos/entrega-recepcion/addoredit-catalogo-descripcion/addoredit-catalogo-descripcion.component';

@Component({
    selector: 'app-list-catalogo-descripcion',
    templateUrl: './list-catalogo-descripcion.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListCatalogoDescripcionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `CatalogoEntregaRecepcionDescripcion`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditCatalogoDescripcionComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`catalogoentregarecepciondescripcion/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
