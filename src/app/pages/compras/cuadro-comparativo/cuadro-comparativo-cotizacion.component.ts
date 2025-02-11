import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CreateOrdenCompraComponent from '../orden-compra/orden-compra/create-orden-compra/create-orden-compra.component';

@Component({
  selector: 'app-cuadro-comparativo-cotizacion',
  templateUrl: './cuadro-comparativo-cotizacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FormsModule, CommonModule, ToastModule],
})
export default class CuadroComparativoCotizacionComponent
  implements OnInit, OnDestroy
{
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  customToastService = inject(CustomToastService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  router = inject(Router);

  cotizacionProveedorId = 0;
  cotizacionProveedor: any;
  solicitudCompra: any;
  solicitudCompraDetalle: any;
  solicitudCompraId = 0;
  nameProvider: string = '';
  posicionCotizacion: number = 0;
  proveedorResult: any[] = [];
  cotizacionesRelacionadas: any[] = [];

  garantia: string = '';
  entrega: string = '';
  politicaPago: string = '';

  ngOnInit(): void {
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;
    this.cotizacionProveedorId = this.config.data.cotizacionProveedorId;

    this.onGetCotizacioProveedor();
    this.onCotizacionesRelacionadas();
    this.onLoadData();
  }

  onGetCotizacioProveedor() {
    const url = `CotizacionProveedor/GetPosicionCotizacion/${this.solicitudCompraId}/${this.posicionCotizacion}`;
    this.apiRequestS.onGetItem(url).then((result: any) => {
      this.cotizacionProveedor = result;
      this.garantia = result.garantia;
      this.entrega = result.entrega;
      this.politicaPago = result.politicaPago;
      this.nameProvider = result.nameProvider;
    });
  }
  onLoadData() {
    const urlApi = `solicitudcompra/${this.solicitudCompraId}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.solicitudCompra = result;
      this.solicitudCompraDetalle = result.solicitudCompraDetalle;
    });
  }

  onUpdateProvider() {
    this.cotizacionProveedor.nameProvider = this.nameProvider;
    this.cotizacionProveedor.garantia = this.garantia;
    this.cotizacionProveedor.entrega = this.entrega;
    this.cotizacionProveedor.politicaPago = this.politicaPago;

    this.apiRequestS
      .onPut(
        `CotizacionProveedor/UpdateProvider/${this.cotizacionProveedor.id}`,
        this.cotizacionProveedor
      )
      .then((result: boolean) => {});
  }

  onChange(item: any) {
    const data = {
      applicationUserId: this.authS.applicationUserId,
      cantidad: item.cantidad,
      descuento: item.descuento,
      descuento2: item.descuento2,
      descuento3: item.descuento3,
      id: item.id,
      iva: item.iva,
      iva2: item.iva2,
      iva3: item.iva3,
      ivaAplicado: item.ivaAplicado,
      ivaAplicado2: item.ivaAplicado2,
      ivaAplicado3: item.ivaAplicado3,
      precio: item.precio,
      precio2: item.precio2,
      precio3: item.precio3,
      productoId: item.productoId,
      solicitudCompraId: item.solicitudCompraId,
      subTotal: item.subTotal,
      subTotal2: item.subTotal2,
      subTotal3: item.subTotal3,
      total: item.total,
      total2: item.total2,
      total3: item.total3,
      unidadMedidaId: item.unidadMedidaId,
    };

    this.apiRequestS
      .onPut(`SolicitudCompraDetalle/UpdatePrice/${item.id}`, data)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDeleteProvider() {
    this.apiRequestS
      .onDelete(
        `solicitudCompra/deleteprovider/${this.solicitudCompraId}/${this.cotizacionProveedorId}`
      )
      .then((result: boolean) => {
        if (result) this.ref.close(true);
      });
  }
  onModalCreateOrdenCompra() {
    this.ref.close(true);
    this.dialogHandlerS.openDialog(
      CreateOrdenCompraComponent,
      {
        solicitudCompraId: this.solicitudCompra.id,
        folioSolicitudCompra: this.solicitudCompra.folio,
        posicionCotizacion: this.posicionCotizacion,
      },
      'Crear Orden de compra',
      this.dialogHandlerS.dialogSizeLg
    );
  }

  onCotizacionesRelacionadas() {
    const urlApi = `OrdenCompra/CotizacionesRelacionadas/${this.solicitudCompraId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.cotizacionesRelacionadas = result;
    });
  }
  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
