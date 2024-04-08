import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditProductosComponent from 'src/app/pages/configuracion/productos/addoredit-productos.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orden-compra-detalle-add-producto',
  templateUrl: './orden-compra-detalle-add-producto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenCompraDetalleAddProductoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authService = inject(AuthService);

  ordenCompraId: number = 0;
  data: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  mensajeError = false;

  id: any;
  cb_unidadMedida: any[] = [];

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });

    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadProduct();
  }

  onLoadProduct() {
    var urlApi = `OrdenCompraDetalle/AddProductoToOrder/${this.ordenCompraId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onSubmit(item: any) {
    if (item.unidadMedidaId === 0 || item.productoId === 0) {
      this.mensajeError = true;
      return;
    }

    item.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;

    this.apiRequestService
      .onPost(`OrdenCompraDetalle/`, item)
      .then((result: boolean) => {
        this.mensajeError = false;
        this.onLoadProduct();
      });
  }

  // ... Llamada al Modal agregar o editar
  showModalAddOrEdit() {
    this.ref.close();

    this.dialogHandlerService.openDialog(
      AddOrEditProductosComponent,
      {
        id: 0,
      },
      'Crear Producto',
      this.dialogHandlerService.dialogSizeMd
    );
  }
}
