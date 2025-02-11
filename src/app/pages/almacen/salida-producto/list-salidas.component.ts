import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import EditSalidasComponent from './edit-salidas.component';

@Component({
  selector: 'app-list-salidas',
  templateUrl: './list-salidas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListSalidasComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `SalidaProductos/GetSalidaProductos/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`salidaproductos/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onEditSalida(data: any) {
    this.dialogHandlerS
      .openDialog(
        EditSalidasComponent,
        {
          id: data.id,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
          idInventarioProducto: data.idInventarioProducto,
        },
        'Salida de Productos',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
