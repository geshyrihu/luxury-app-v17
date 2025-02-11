import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProductoListAdd } from 'src/app/core/interfaces/product-list-add-or-edit.interface.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TarjetaProductoComponent from '../../settings/catalogos/productos/tarjeta-producto.component';

@Component({
    selector: 'app-add-productos-almacen',
    templateUrl: './add-productos-almacen.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class AddProductosAlmacenComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  ref = inject(DynamicDialogRef);

  data: any[] = [];
  cb_UnidadMedida: any[] = [];
  mensajeError = '';

  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_UnidadMedida = response;
      });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.onLoadData();
  }

  onModalTarjetaProducto(productoId: number): void {
    this.dialogHandlerS
      .openDialog(
        TarjetaProductoComponent,
        {
          productoId: productoId,
        },
        'Tarjeta de Producto',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onLoadData() {
    const urlApi = `InventarioProducto/GetProductoDropdownDto/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onSubmit(item: IProductoListAdd) {
    item.applicationUserId = this.authS.applicationUserId;
    item.customerId = this.customerIdS.customerId;

    if (
      item.existencia < 0 ||
      item.unidadDeMedidaId == 0 ||
      item.stockMax == 0 ||
      item.stockMin == 0
    ) {
      this.mensajeError =
        'Completa todos los campos :Existencia, Unidad, Stok Max,   Stok Min';
      return;
    }

    this.apiRequestS
      .onPost(`InventarioProducto/`, item)
      .then((responseData: boolean) => {
        this.mensajeError = '';
        this.onLoadData();
      });
  }
}
