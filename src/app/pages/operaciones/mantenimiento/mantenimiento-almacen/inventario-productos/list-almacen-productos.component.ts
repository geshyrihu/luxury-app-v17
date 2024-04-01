import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import TarjetaProductoComponent from '../../mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';
import AddOrEditEntradasComponent from '../entradas/addoredit-entradas.component';
import CrudSalidasComponent from '../salidas/addoredit-salidas.component';
import AddProductosAlmacenComponent from './add-productos-almacen.component';
import EditProductosAlmacenComponent from './edit-productos-almacen.component';

const urlImgBase = environment.base_urlImg;

@Component({
  selector: 'app-list-almacen-productos',
  templateUrl: './list-almacen-productos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListAlmacenProductosComponent
  implements OnInit, OnDestroy
{
  private customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  ref: DynamicDialogRef;

  urlImgBase = urlImgBase + 'Administration/products/';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  rowGroupMetadata: any = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        let rowData = this.data[i];
        let representativeName = rowData.category;
        if (i == 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.data[i - 1];
          let previousRowGroup = previousRowData.category;
          if (representativeName === previousRowGroup)
            this.rowGroupMetadata[representativeName].size++;
          else
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
        }
      }
    }
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        'InventarioProducto/GetAsyncAll/' + this.customerIdService.customerId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.updateRowGroupMetaData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`InventarioProducto/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  editProductos(data: any) {
    this.ref = this.dialogService.open(EditProductosAlmacenComponent, {
      data: {
        id: data.id,
        idProducto: data.idProducto,
      },
      header: data.title,
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
  addProductos(data: any) {
    this.ref = this.dialogService.open(AddProductosAlmacenComponent, {
      data: {
        id: data.id,
        idProducto: data.idProducto,
      },
      header: data.title,
      height: 'auto',
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

  onAddEntrada(data: any) {
    this.ref = this.dialogService.open(AddOrEditEntradasComponent, {
      data: {
        id: 0,
        idProducto: data.idProducto,
        nombreProducto: data.nombreProducto,
      },
      header: 'Entrada de Productos',
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
  onAddSalida(data: any) {
    this.ref = this.dialogService.open(CrudSalidasComponent, {
      data: {
        id: data.id,
        idInventarioProducto: data.idInventarioProducto,
        idProducto: data.idProducto,
        nombreProducto: data.nombreProducto,
      },
      header: 'Salida de Productos',
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

  onModalTarjetaProducto(productoId: number): void {
    this.ref = this.dialogService.open(TarjetaProductoComponent, {
      data: {
        productoId: productoId,
      },
      header: 'Tarjeta de Producto',
      width: '1000px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
