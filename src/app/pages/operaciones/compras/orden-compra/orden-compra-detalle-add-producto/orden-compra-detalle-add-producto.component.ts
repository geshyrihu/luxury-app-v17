import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import AddProductosAlmacenComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/inventario-productos/add-productos-almacen.component';
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

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.dataService
      .get(`OrdenCompraDetalle/AddProductoToOrder/${this.ordenCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
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
    this.dataService
      .post<any>(`OrdenCompraDetalle/`, item)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.mensajeError = false;
          this.onLoadProduct();
          this.ref.close(true);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
