import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import ProductosAddOrEditComponent from './productos-addoredit.component';

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ProductosListComponent implements OnInit {
  authS = inject(AuthService);
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);

  urlBaseImg = `${environment.base_urlImg}Administration/products/`;
  urlBaseImgUser = `${environment.base_urlImg}Administration/accounts/`;
  data: any[] = [];

  ref: DynamicDialogRef;

  account_id: string =
    this.authS.userTokenDto.infoUserAuthDto.applicationUserId;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService.onGetList('Productos').then((result: any) => {
      this.data = result;
    });
  }

  // ... Eliminar registro
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`productos/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  // ... Llamada al Modal agregar o editar
  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        ProductosAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
