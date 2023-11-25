import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import AddProductosAlmacenComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/inventario-productos/add-productos-almacen.component';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orden-compra-detalle-add-producto',
  templateUrl: './orden-compra-detalle-add-producto.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, PrimeNgModule],
  providers: [CustomToastService],
})
export default class OrdenCompraDetalleAddProductoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  subRef$: Subscription;

  ordenCompraId: number = 0;
  data: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  mensajeError = false;

  id: any;
  cb_unidadMedida: any[] = [];

  ngOnInit(): void {
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_unidadMedida = resp;
      });
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadProduct();
  }

  onLoadProduct() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompraDetalle/AddProductoToOrder/${this.ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onSubmit(item: any) {
    if (item.unidadMedidaId === 0 || item.productoId === 0) {
      this.mensajeError = true;
      return;
    }

    item.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.subRef$ = this.dataService
      .post<any>(`OrdenCompraDetalle/`, item)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.mensajeError = false;
          this.onLoadProduct();
          this.ref.close(true);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  // ... Llamada al Modal agregar o editar
  showModalAddOrEdit() {
    this.ref.close();
    this.ref = this.dialogService.open(AddProductosAlmacenComponent, {
      data: {
        id: 0,
      },
      header: 'Crear Producto',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
