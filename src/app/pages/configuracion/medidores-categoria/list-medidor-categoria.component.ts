import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IMedidorCategoriaDto } from 'src/app/core/interfaces/IMedidorCategoriaDto.interface';
import { ApiRequestService } from 'src/app/core/services/common-services';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FormMedidorCategoriaComponent from './addoredit-medidor-categoria.component';

@Component({
  selector: 'app-list-medidor-categoria',
  templateUrl: './list-medidor-categoria.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMedidorCategoriaComponent implements OnInit {
  public dialogHandlerService = inject(DialogHandlerService);
  public apiRequestService = inject(ApiRequestService);

  data: IMedidorCategoriaDto[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService.onGetList('MedidorCategoria').then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`medidorcategoria/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        FormMedidorCategoriaComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
