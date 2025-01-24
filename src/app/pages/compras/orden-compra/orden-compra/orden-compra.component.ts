import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';
import OrdenCompraDatosCotizacionComponent from '../components/orden-compra-datos-cotizacion.component';
import OrdenCompraDatosPagoParcialComponent from '../components/orden-compra-datos-pago-parcial.component';
import OrdenCompraStatusParcialComponent from '../components/orden-compra-status-parcial.component';
import OrdenCompraDatosPagoComponent from '../orden-compra-datos-pago/orden-compra-datos-pago.component';
import OrdenCompraDetalleAddProductoComponent from '../orden-compra-detalle-add-producto/orden-compra-detalle-add-producto.component';
import OrdenCompraPresupuestoComponent from '../orden-compra-presupuesto/orden-compra-presupuesto.component';
import OrdenCompraStatusComponent from '../orden-compra-status/orden-compra-status.component';
import OrdenCompraDenegadaComponent from './../orden-compra-denegada/orden-compra-denegada.component';
import ModalOrdenCompraComponent from './modal-orden-compra.component';
import OrdenCompraEditDetalleComponent from './orden-compra-edit-detalle.component';
import OrdenCompraEditPresupustoUtilizadoComponent from './orden-compra-edit-presupusto-utilizado.component';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    FormsModule,
    OrdenCompraDatosCotizacionComponent,
    OrdenCompraDatosPagoParcialComponent,
    OrdenCompraStatusParcialComponent,
    ContextMenuModule,
    ConfirmDialogModule,
  ],
})
export default class OrdenCompraComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  routeActive = inject(ActivatedRoute);
  router = inject(Router);
  messageService = inject(MessageService);
  ordenCompraService = inject(OrdenCompraService);
  confirmationService = inject(ConfirmationService);

  ref: DynamicDialogRef;

  ordenCompraId: number = 0;
  ordenCompra: any;
  ordenCompraPresupuestoUtilizado: any[] = [];
  ordenCompraDetalle: any[] = [];
  nombreAutorizador = '';

  ordenCompraEstaAutorizada: boolean = false;

  solicitudCompraId: number = 0;
  esNumeroNegativo = false;
  totalRelacionadoConOtrasOrdenes: number = 0;
  totalOrdenCompra = 0;
  totalCubrir: number = 0;
  iva: number = 0;
  retencionIva: number = 0;
  subtotal: number = 0;
  revisadaPorResidente: boolean = false;
  icon: string = '';

  esGastoFijo: boolean = false;

  items: MenuItem[];
  itemsDetalle: MenuItem[];
  presupuestoSeleccionado: any;
  ordenCompraDetalleSeleccionado: any;
  mensajeRevision: string = '';

  ngOnInit(): void {
    this.ordenCompraId = this.routeActive.snapshot.params.id;
    if (this.ordenCompraId == undefined) {
      this.ordenCompraId = this.ordenCompraService.getOrdenCompraId();
    }

    this.onLoadData();
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-search',
        command: () => {
          this.editPresupuesto(this.presupuestoSeleccionado);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => {
          this.deletePresupuesto(this.presupuestoSeleccionado);
        },
      },
    ];
    this.itemsDetalle = [
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-search',
        command: () => {
          this.editDetalle(this.ordenCompraDetalleSeleccionado);
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => {
          this.deleteDetalle(this.ordenCompraDetalleSeleccionado);
        },
      },
    ];
  }
  editPresupuesto(item: any): void {
    this.onModalEditarPresupuestoUtilizado(item.id);
  }
  deletePresupuesto(item: any): void {
    this.confirm();
  }
  editDetalle(item: any): void {
    this.onModalEditarDetalle(item.id);
  }
  deleteDetalle(item: any): void {
    this.confirmDeleteDetalle();
  }

  confirm() {
    this.confirmationService.confirm({
      message: `
        <p>¿Estás segura de que quieres eliminar el siguiente registro?</p>
        `,
      accept: () => {
        this.onDeleteOrdenCompraPresupuesto(this.presupuestoSeleccionado.id);
        //Actual logic to perform a confirmation
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelado',
          detail: 'Operación cancelada',
        });
      },
    });
  }
  confirmDeleteDetalle() {
    this.confirmationService.confirm({
      message: `
        <p>¿Estás segura de que quieres eliminar el siguiente registro?</p>
        `,
      accept: () => {
        this.onDeleteProduct(this.ordenCompraDetalleSeleccionado);
        //Actual logic to perform a confirmation
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelado',
          detail: 'Operación cancelada',
        });
      },
    });
  }

  validarOrdenesCompraMismoFolioSolicituCompra() {
    const urlApi =
      'OrdenCompra/ValidarOrdenesCompraMismoFolioSolicituCompra/' +
      this.ordenCompraId;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.totalRelacionadoConOtrasOrdenes = result;
    });
  }

  onLoadData() {
    this.esGastoFijo = false;
    // Mostrar un mensaje de carga

    const urlApi = `OrdenCompra/${this.ordenCompraId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.ordenCompra = result;
      if (this.ordenCompra.ordenCompraDatosPago.tipoGasto === 0) {
        this.esGastoFijo = true;
      }
      this.ordenCompraDetalle = this.ordenCompra.ordenCompraDetalle;
      this.ordenCompraPresupuestoUtilizado =
        this.ordenCompra.ordenCompraPresupuestoUtilizado;
      this.ordenCompraService.actualizarTotalOrdenCompra(this.ordenCompraId);
      this.cargarTotalesOrdenCompra();
      if (this.ordenCompra.folioSolicitudCompra) {
        this.apiRequestService
          .onGetList(
            `SolicitudCompra/GetIdSolicitudCompra/${this.ordenCompra.folioSolicitudCompra}/${this.ordenCompra.customerId}`
          )
          .then((result: any) => {
            this.solicitudCompraId = result;
          });
      }
      if (this.ordenCompra.ordenCompraAuth.revisadoPorResidente?.length > 0) {
        this.revisadaPorResidente = true;
        this.mensajeRevision = 'Revocar Revisión';
      } else {
        this.revisadaPorResidente = false;
        this.mensajeRevision = 'Validar Revisión';
      }
      //   Fin Validando si ya fue revisada por el Residente

      if (this.ordenCompra.ordenCompraAuth.statusOrdenCompra === 0) {
        this.ordenCompraEstaAutorizada = true;
      }
      if (
        this.ordenCompra.ordenCompraAuth.statusOrdenCompra === 1 ||
        this.ordenCompra.ordenCompraAuth.statusOrdenCompra === 2
      ) {
        this.ordenCompraEstaAutorizada = false;
      }
      if (this.ordenCompra.ordenCompraAuth.applicationUserAuthId !== null) {
        this.nombreAutorizador = `${this.ordenCompra.ordenCompraAuth.applicationUserAuthId} `;
      }

      if (this.ordenCompraService.getTotalPorCubrir() < 0) {
        this.esNumeroNegativo = true;
      }

      // Buscar Ordenes de compra relacionadas
      if (this.ordenCompra.folioSolicitudCompra) {
        this.validarOrdenesCompraMismoFolioSolicituCompra();
      }
    });
  }

  autorizarCompra() {
    const urlApi = `OrdenCompraAuth/Autorizar/${this.ordenCompraId}/${this.authS.applicationUserId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }

  deautorizarCompra() {
    const urlApi = `OrdenCompraAuth/Desautorizar/${this.ordenCompraId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.nombreAutorizador = '';
      this.onLoadData();
    });
  }

  //... Modales

  onModalEditarPresupuestoUtilizado(id: number) {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraEditPresupustoUtilizadoComponent,
        { id: id },
        'Actualizar presupuesto utilizado',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        this.onLoadData();
      });
  }
  onModalEditarDetalle(id: number) {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraEditDetalleComponent,
        { id: id },
        'Actualizar ' + this.ordenCompraDetalleSeleccionado.producto,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalOrdenCompra() {
    this.dialogHandlerService
      .openDialog(
        ModalOrdenCompraComponent,
        {
          ordenCompra: this.ordenCompra,
        },
        'Actualizar información',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalOrdenCompraDatosPago() {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraDatosPagoComponent,
        {
          ordenCompra: this.ordenCompra,
        },
        'Autorizar Datos de pago',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalOrdenCompraStatus() {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraStatusComponent,
        {
          ordenCompraId: this.ordenCompraId,
        },
        'Autorizar Status de Orden de compra',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalOrdenCompraPresupuesto() {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraPresupuestoComponent,
        {
          ordenCompraId: this.ordenCompraId,
        },
        'Selecciona partida presupuestal',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalAgregarproducto() {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraDetalleAddProductoComponent,
        {
          ordenCompraId: this.ordenCompraId,
        },
        'Agregar producto o Servicio',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalcompraNoAutorizada() {
    this.dialogHandlerService
      .openDialog(
        OrdenCompraDenegadaComponent,
        {
          ordenCompraId: this.ordenCompra.id,
          ordenCompraAuthId: this.ordenCompra.ordenCompraAuth.id,
        },
        'Denegar Orden de Compra',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //... Fin Modales
  onCuadroComparativo(idSolicitudCompra: number) {
    this.router.navigateByUrl(`compras/cuadroComparativo/${idSolicitudCompra}`);
  }
  // ... Editar presupeusto del que se va a disponer
  onEditOrdenCompraPresupuesto(item: any): void {
    this.apiRequestService
      .onPut(`OrdenCompraPresupuesto/${item.id}`, item)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }
  onDeleteOrdenCompraPresupuesto(id: number): void {
    const urlApi = `OrdenCompraPresupuesto/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData();
    });
  }
  // TODO: PARECE QUE ESTE METODO NO SE UTILIZA
  onDeleteProduct(data: any): void {
    const urlApi = `OrdenCompraDetalle/${data.id}`;
    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData();
    });
  }
  onSubmitProducto(item: any): void {
    const data = {
      cantidad: item.cantidad,
      descuento: item.descuento,
      id: item.id,
      iva: item.iva,
      ivaAplicado: item.ivaAplicado,
      ordenCompraId: item.ordenCompraId,
      precio: item.precio,
      productoId: item.productoId,
      subTotal: item.subTotal,
      total: item.total,
      unidadMedidaId: item.unidadMedidaId,
    };
    this.apiRequestService
      .onPut(`OrdenCompraDetalle/${item.id}`, data)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }
  cargarTotalesOrdenCompra() {
    let subTotal = 0;
    let retencionIva = 0;
    let ivaTotal = 0;
    for (let n of this.ordenCompraDetalle) {
      subTotal += n.subTotal;
      if (n.unidadMedidaId === 14) {
        retencionIva += n.subTotal;
      }
    }
    for (let n of this.ordenCompraDetalle) {
      ivaTotal += n.iva;
    }

    this.retencionIva = retencionIva * 0.06;
    this.subtotal = subTotal;
    this.iva = ivaTotal;
    this.subtotal = subTotal;
    this.totalOrdenCompra = this.subtotal + this.iva - this.retencionIva;
  }
}
