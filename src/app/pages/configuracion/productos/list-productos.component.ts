import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ApiRequestService,
  AuthService,
} from 'src/app/core/services/common-services';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddOrEditProductosComponent from './addoredit-productos.component';

@Component({
  selector: 'app-list-productos',
  templateUrl: './list-productos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListProductosComponent implements OnInit {
  public authService = inject(AuthService);
  public dialogHandlerService = inject(DialogHandlerService);
  public apiRequestService = inject(ApiRequestService);

  urlBaseImg = `${environment.base_urlImg}Administration/products/`;
  urlBaseImgUser = `${environment.base_urlImg}Administration/accounts/`;
  data: any[] = [];

  ref: DynamicDialogRef;

  account_id: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;

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
        AddOrEditProductosComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
