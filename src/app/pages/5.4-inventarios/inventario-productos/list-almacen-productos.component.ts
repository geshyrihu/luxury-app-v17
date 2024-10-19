import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import CrudSalidasComponent from '../../8.0-reportes/mantenimiento/mantenimiento-almacen/salidas/addoredit-salidas.component';
import TarjetaProductoComponent from '../../8.0-reportes/mantenimiento/mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';
import AddOrEditEntradasComponent from '../almacenes/entrada-producto/addoredit-entradas.component';
import AddProductosAlmacenComponent from './add-productos-almacen.component';
import EditProductosAlmacenComponent from './edit-productos-almacen.component';

const urlImgBase = environment.base_urlImg;

@Component({
  selector: 'app-list-almacen-productos',
  templateUrl: './list-almacen-productos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListAlmacenProductosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);
  authService = inject(AuthService);

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
    const urlApi =
      'InventarioProducto/GetAsyncAll/' + this.customerIdService.customerId;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.updateRowGroupMetaData();
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
    this.dialogHandlerService
      .openDialog(
        EditProductosAlmacenComponent,
        {
          id: data.id,
          idProducto: data.idProducto,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  addProductos(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddProductosAlmacenComponent,
        {
          id: data.id,
          idProducto: data.idProducto,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onAddEntrada(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditEntradasComponent,
        {
          id: 0,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
        },
        'Entrada de Productos',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onAddSalida(data: any) {
    this.dialogHandlerService
      .openDialog(
        CrudSalidasComponent,
        {
          id: data.id,
          idInventarioProducto: data.idInventarioProducto,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
        },
        'Salida de Productos',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalTarjetaProducto(productoId: number): void {
    this.dialogHandlerService.openDialog(
      TarjetaProductoComponent,
      {
        productoId: productoId,
      },
      'Tarjeta de Producto',
      this.dialogHandlerService.dialogSizeLg
    );
  }
}
