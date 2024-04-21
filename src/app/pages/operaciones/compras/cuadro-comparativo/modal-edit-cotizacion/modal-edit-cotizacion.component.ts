import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CreateOrdenCompraComponent from '../../orden-compra/orden-compra/create-orden-compra/create-orden-compra.component';

@Component({
  selector: 'app-modal-edit-cotizacion',
  templateUrl: './modal-edit-cotizacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FormsModule, CommonModule, ToastModule],
})
export default class ModalEditCotizacionComponent implements OnInit, OnDestroy {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  customToastService = inject(CustomToastService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  dataService = inject(DataService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  router = inject(Router);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.apiRequestService.onGetItem(url).then((result: any) => {
      this.cotizacionProveedor = result;
      this.garantia = result.garantia;
      this.entrega = result.entrega;
      this.politicaPago = result.politicaPago;
      this.nameProvider = result.nameProvider;
    });
  }
  onLoadData() {
    this.dataService
      .get<any>(`solicitudcompra/${this.solicitudCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.solicitudCompra = resp.body;
          this.solicitudCompraDetalle = resp.body.solicitudCompraDetalle;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onUpdateProvider() {
    this.cotizacionProveedor.nameProvider = this.nameProvider;
    this.cotizacionProveedor.garantia = this.garantia;
    this.cotizacionProveedor.entrega = this.entrega;
    this.cotizacionProveedor.politicaPago = this.politicaPago;

    this.dataService
      .put(
        `CotizacionProveedor/UpdateProvider/${this.cotizacionProveedor.id}`,
        this.cotizacionProveedor
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onChange(item: any) {
    const data = {
      employeeId: item.employeeId,
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
    this.dataService
      .put(`SolicitudCompraDetalle/UpdatePrice/${item.id}`, data)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDeleteProvider() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(
        `solicitudCompra/deleteprovider/${this.solicitudCompraId}/${this.cotizacionProveedorId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onModalCreateOrdenCompra() {
    this.ref.close(true);
    this.dialogHandlerService.openDialog(
      CreateOrdenCompraComponent,
      {
        solicitudCompraId: this.solicitudCompra.id,
        folioSolicitudCompra: this.solicitudCompra.folio,
        posicionCotizacion: this.posicionCotizacion,
      },
      'Crear Orden de compra',
      this.dialogHandlerService.dialogSizeLg
    );
  }

  onCotizacionesRelacionadas() {
    this.dataService
      .get(`OrdenCompra/CotizacionesRelacionadas/${this.solicitudCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cotizacionesRelacionadas = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
