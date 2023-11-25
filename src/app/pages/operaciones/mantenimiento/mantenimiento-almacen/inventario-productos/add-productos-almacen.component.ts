import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IProductoListAddDto } from 'src/app/core/interfaces/IProductoListAddDto.interface.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import TarjetaProductoComponent from '../../mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-add-productos-almacen',
  templateUrl: './add-productos-almacen.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
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
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(
        `InventarioProducto/GetProductoDropdownDto/${this.customerIdService.customerId}`
      )
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

    this.subRef$ = this.dataService
      .post(`InventarioProducto/`, item)
      .subscribe({
        next: () => {
          this.mensajeError = '';
          this.customToastService.onClose();
          this.onLoadData();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
