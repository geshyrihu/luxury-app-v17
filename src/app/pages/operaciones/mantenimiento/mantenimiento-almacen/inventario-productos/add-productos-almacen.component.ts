import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IProductoListAddDto } from 'src/app/core/interfaces/IProductoListAddDto.interface.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';

import TarjetaProductoComponent from '../../mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-add-productos-almacen',
  templateUrl: './add-productos-almacen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddProductosAlmacenComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public ref = inject(DynamicDialogRef);

  data: any[] = [];
  cb_UnidadMedida: any[] = [];
  mensajeError = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_UnidadMedida = resp;
      });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.onLoadData();
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
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `InventarioProducto/GetProductoDropdownDto/${this.customerIdService.customerId}`
      )
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
  onSubmit(item: IProductoListAddDto) {
    item.employeeId = this.authService.userTokenDto.infoEmployeeDto.employeeId;
    item.customerId = this.customerIdService.customerId;

    if (
      item.existencia < 0 ||
      item.unidadDeMedidaId == 0 ||
      item.stockMax == 0 ||
      item.stockMin == 0
    ) {
      this.mensajeError =
        'Completa todos los campos :Existencia, Unidad, Stok Max,   Stok Min';
      return;
    }
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(`InventarioProducto/`, item)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.mensajeError = '';
          this.customToastService.onClose();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
