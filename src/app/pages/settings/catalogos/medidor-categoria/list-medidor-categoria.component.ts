import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IMedidorCategoria } from 'src/app/core/interfaces/medidor-categoria.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FormMedidorCategoriaComponent from './addoredit-medidor-categoria.component';

@Component({
  selector: 'app-list-medidor-categoria',
  templateUrl: './list-medidor-categoria.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMedidorCategoriaComponent implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);

  data: IMedidorCategoria[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS.onGetList('MedidorCategoria').then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`medidorcategoria/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        FormMedidorCategoriaComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
