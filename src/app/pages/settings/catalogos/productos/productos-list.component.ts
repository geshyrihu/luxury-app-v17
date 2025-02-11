import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ProductosAddOrEditComponent from './productos-addoredit.component';

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ProductosListComponent implements OnInit {
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);

  data: any[] = [];

  ref: DynamicDialogRef;

  account_id: string =
    this.authS.userTokenDto.infoUserAuthDto.applicationUserId;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS.onGetList('Productos').then((responseData: any) => {
      this.data = responseData;
    });
  }

  // ... Eliminar registro
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`productos/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  // ... Llamada al Modal agregar o editar
  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductosAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
