import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditEntradasComponent from '../../almacen/entrada-producto/addoredit-entradas.component';
import CrudSalidasComponent from '../../almacen/salida-producto/addoredit-salidas.component';
import TarjetaProductoComponent from '../../settings/catalogos/productos/tarjeta-producto.component';
import AddProductosAlmacenComponent from './add-productos-almacen.component';
import EditProductosAlmacenComponent from './edit-productos-almacen.component';

@Component({
  selector: 'app-list-almacen-productos',
  templateUrl: './list-almacen-productos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListAlmacenProductosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  rowGroupMetadata: any = this.customerIdS.getCustomerId$();

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
      'InventarioProducto/GetAsyncAll/' + this.customerIdS.customerId;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.updateRowGroupMetaData();
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`InventarioProducto/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  editProductos(data: any) {
    this.dialogHandlerS
      .openDialog(
        EditProductosAlmacenComponent,
        {
          id: data.id,
          idProducto: data.idProducto,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  addProductos(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddProductosAlmacenComponent,
        {
          id: data.id,
          idProducto: data.idProducto,
        },
        data.title,
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onAddEntrada(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditEntradasComponent,
        {
          id: 0,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
        },
        'Entrada de Productos',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onAddSalida(data: any) {
    this.dialogHandlerS
      .openDialog(
        CrudSalidasComponent,
        {
          id: data.id,
          idInventarioProducto: data.idInventarioProducto,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
        },
        'Salida de Productos',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalTarjetaProducto(productoId: number): void {
    this.dialogHandlerS.openDialog(
      TarjetaProductoComponent,
      {
        productoId: productoId,
      },
      'Tarjeta de Producto',
      this.dialogHandlerS.dialogSizeLg
    );
  }
}
