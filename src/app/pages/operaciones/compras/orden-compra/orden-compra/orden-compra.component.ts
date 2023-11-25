import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  OrdenCompraService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import OrdenCompraDatosPagoParcialComponent from '../components/orden-compra-datos-pago-parcial/orden-compra-datos-pago-parcial.component';
import OrdenCompraDatosCotizacionComponent from '../components/orden-compra-parcial/orden-compra-datos-cotizacion.component';
import OrdenCompraStatusParcialComponent from '../components/orden-compra-status-parcial/orden-compra-status-parcial.component';
import OrdenCompraDatosPagoComponent from '../orden-compra-datos-pago/orden-compra-datos-pago.component';
import OrdenCompraDetalleAddProductoComponent from '../orden-compra-detalle-add-producto/orden-compra-detalle-add-producto.component';
import OrdenCompraPresupuestoComponent from '../orden-compra-presupuesto/orden-compra-presupuesto.component';
import OrdenCompraStatusComponent from '../orden-compra-status/orden-compra-status.component';
import OrdenCompraDenegadaComponent from './../orden-compra-denegada/orden-compra-denegada.component';
// import ModalOrdenCompraComponent from './modal-orden-compra.component';
import ModalOrdenCompraComponent from './modal-orden-compra.component';
import OrdenCompraEditDetalleComponent from './orden-compra-edit-detalle.component';
import OrdenCompraEditPresupustoUtilizadoComponent from './orden-compra-edit-presupusto-utilizado.component';
@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    OrdenCompraDatosCotizacionComponent,
    OrdenCompraDatosPagoParcialComponent,
    OrdenCompraStatusParcialComponent,
    OrdenCompraEditPresupustoUtilizadoComponent,
    PrimeNgModule,
    ContextMenuModule,
    ConfirmDialogModule,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class OrdenCompraComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public routeActive = inject(ActivatedRoute);
  public router = inject(Router);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ordenCompraService = inject(OrdenCompraService);
  public selectItemService = inject(SelectItemService);
  public confirmationService = inject(ConfirmationService);
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ordenCompraId: number = 0;
  ordenCompra: any;
  ordenCompraPresupuestoUtilizado: any[] = [];
  ordenCompraDetalle: any[] = [];
  nombreAutorizador = '';

  applicationUserId: string = '';
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
    this.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
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
    this.subRef$ = this.dataService
      .get(
        'OrdenCompra/ValidarOrdenesCompraMismoFolioSolicituCompra/' +
          this.ordenCompraId
      )
      .subscribe((resp: any) => {
        this.totalRelacionadoConOtrasOrdenes = resp.body;
      });
  }

  onLoadData() {
    this.esGastoFijo = false;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompra/${this.ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          console.log('🚀 ~ resp.body:', resp.body);
          this.customToastService.onClose();
          this.ordenCompra = resp.body;
          if (this.ordenCompra.ordenCompraDatosPago.tipoGasto === 0) {
            this.esGastoFijo = true;
          }
          this.ordenCompraDetalle = this.ordenCompra.ordenCompraDetalle;
          this.ordenCompraPresupuestoUtilizado =
            this.ordenCompra.ordenCompraPresupuestoUtilizado;
          this.ordenCompraService.actualizarTotalOrdenCompra(
            this.ordenCompraId
          );
          this.cargarTotalesOrdenCompra();

          //... Obtener Id SolicitudCompra

          if (this.ordenCompra.folioSolicitudCompra) {
            this.subRef$ = this.dataService
              .get(
                `SolicitudCompra/GetIdSolicitudCompra/${this.ordenCompra.folioSolicitudCompra}/${this.ordenCompra.customerId}`
              )
              .subscribe((resp: any) => {
                this.solicitudCompraId = resp.body;
              });
          }
          //...Fin Obtener Id SolicitudCompra

          //   Validando si ya fue revisada por el Residente

          if (
            this.ordenCompra.ordenCompraAuth.revisadoPorResidente.length > 0
          ) {
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
          // Fin Buscar Ordenes de compra relacionadas

          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  autorizarCompra() {
    // this.onRevisadaPorResidente();
    this.subRef$ = this.dataService
      .get(
        `OrdenCompraAuth/Autorizar/${this.ordenCompraId}/${this.authService.userTokenDto.infoEmployeeDto.employeeId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  deautorizarCompra() {
    this.subRef$ = this.dataService
      .get(`OrdenCompraAuth/Desautorizar/${this.ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.nombreAutorizador = '';
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  //... Modales

  onModalEditarPresupuestoUtilizado(id: number) {
    this.ref = this.dialogService.open(
      OrdenCompraEditPresupustoUtilizadoComponent,
      {
        data: {
          id,
        },
        header: 'Actualizar presupuesto utilizado',
        width: '20%',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalEditarDetalle(id: number) {
    this.ref = this.dialogService.open(OrdenCompraEditDetalleComponent, {
      data: {
        id,
      },
      header: 'Actualizar ' + this.ordenCompraDetalleSeleccionado.producto,
      width: '50%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onModalOrdenCompra() {
    this.ref = this.dialogService.open(ModalOrdenCompraComponent, {
      data: {
        ordenCompra: this.ordenCompra,
      },
      header: 'Actualizar información',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalOrdenCompraDatosPago() {
    this.ref = this.dialogService.open(OrdenCompraDatosPagoComponent, {
      data: {
        ordenCompra: this.ordenCompra,
      },
      header: 'Autorizar Datos de pago',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalOrdenCompraStatus() {
    this.ref = this.dialogService.open(OrdenCompraStatusComponent, {
      data: {
        ordenCompraId: this.ordenCompraId,
      },
      header: 'Autorizar Status de Orden de compra',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalOrdenCompraPresupuesto() {
    this.ref = this.dialogService.open(OrdenCompraPresupuestoComponent, {
      data: {
        ordenCompraId: this.ordenCompraId,
      },
      header: 'Selecciona partida presupuestal',
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalAgregarproducto() {
    this.ref = this.dialogService.open(OrdenCompraDetalleAddProductoComponent, {
      data: {
        ordenCompraId: this.ordenCompraId,
      },
      header: 'Agregar producto o Servicio',
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalcompraNoAutorizada() {
    this.ref = this.dialogService.open(OrdenCompraDenegadaComponent, {
      data: {
        ordenCompraId: this.ordenCompra.id,
        ordenCompraAuthId: this.ordenCompra.ordenCompraAuth.id,
      },
      header: 'Denegar Orden de Compra',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //... Fin Modales
  onCuadroComparativo(idSolicitudCompra: number) {
    this.router.navigateByUrl(`compras/cuadroComparativo/${idSolicitudCompra}`);
  }
  // ... Editar presupeusto del que se va a disponer
  onEditOrdenCompraPresupuesto(item: any): void {
    this.subRef$ = this.dataService
      .put(`OrdenCompraPresupuesto/${item.id}`, item)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onDeleteOrdenCompraPresupuesto(id: number): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`OrdenCompraPresupuesto/${id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onDeleteProduct(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`OrdenCompraDetalle/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
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
    this.subRef$ = this.dataService
      .put(`OrdenCompraDetalle/${item.id}`, data)
      .subscribe({
        next: () => {
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
