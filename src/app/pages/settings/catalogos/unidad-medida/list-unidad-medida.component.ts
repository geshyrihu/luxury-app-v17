import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditUnidadMedidaComponent from './addoredit-unidad-medida.component';

@Component({
    selector: 'app-list-unidad-medida',
    templateUrl: './list-unidad-medida.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListUnidadMedidaComponent implements OnInit {
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);

  data: any[] = [];

  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS.onGetList('UnidadMedida').then((responseData: any) => {
      this.data = responseData;
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`unidadmedida/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditUnidadMedidaComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
