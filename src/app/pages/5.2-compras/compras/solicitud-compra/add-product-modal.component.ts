import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TarjetaProductoComponent from 'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddProductModalComponent implements OnInit, OnDestroy {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);

  isInRole: boolean;
  id: any = 0;
  data: any[] = [];
  mensajeError = false;

  solicitudCompraId: number = 0;
  cb_unidadMedida: ISelectItem[] = [];

  constructor() {
    this.apiRequestService
      .onGetSelectItem('GetMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.onLoadProduct();
  }

  onLoadProduct() {
    this.apiRequestService
      .onGetList(
        `SolicitudCompraDetalle/AddProductoToSolicitudDto/${this.solicitudCompraId}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }

  onSubmit(item: any) {
    if (
      item.unidadMedidaId === '' ||
      item.productoId === 0 ||
      item.cantidad === 0
    ) {
      this.mensajeError = true;
      return;
    }

    item.applicationUserId = this.authS.applicationUserId;
    this.apiRequestService
      .onPost(`solicitudcompradetalle/`, item)
      .then((result: boolean) => {
        this.mensajeError = false;
        this.onLoadProduct();
      });
  }

  onModalTarjetaProducto(productoId: number): void {
    this.dialogHandlerService.openDialog(
      TarjetaProductoComponent,
      {
        productoId: productoId,
      },
      'Tarjeta de Producto',
      this.dialogHandlerService.dialogSizeMd
    );
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
