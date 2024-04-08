import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProductoListAdd } from 'src/app/core/interfaces/product-list-add-or-edit.interface.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TarjetaProductoComponent from '../../mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-add-productos-almacen',
  templateUrl: './add-productos-almacen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddProductosAlmacenComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  ref = inject(DynamicDialogRef);

  data: any[] = [];
  cb_UnidadMedida: any[] = [];
  mensajeError = '';

  onLoadSelectItem() {
    this.apiRequestService
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
    this.dialogHandlerService
      .openDialog(
        TarjetaProductoComponent,
        {
          productoId: productoId,
        },
        'Tarjeta de Producto',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onLoadData() {
    const urlApi = `InventarioProducto/GetProductoDropdownDto/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onSubmit(item: IProductoListAdd) {
    item.employeeId = this.authService.userTokenDto.infoEmployeeDto.employeeId;
    item.customerId = this.customerIdService.customerId;

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

    this.apiRequestService
      .onPost(`InventarioProducto/`, item)
      .then((result: boolean) => {
        this.mensajeError = '';
        this.onLoadData();
      });
  }
}
