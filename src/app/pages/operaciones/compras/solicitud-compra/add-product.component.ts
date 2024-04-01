import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';
import TarjetaProductoComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddProductComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  formBuilder = inject(FormBuilder);
  private solicitudCompraService = inject(SolicitudCompraService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: any = 0;
  products: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  ref: DynamicDialogRef;

  @Input()
  solicitudCompraId: number = 0;
  cb_measurement_units: ISelectItem[] = [];

  @Output()
  updateData = new EventEmitter<void>();

  onUpdateData() {
    this.updateData.emit();
  }

  ngOnInit(): void {
    this.solicitudCompraService.deleteProduct$.subscribe(() => {
      this.onLoadProduct();
    });
    this.onLoadProduct();

    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_measurement_units = response;
      });
  }

  onLoadProduct() {
    this.dataService
      .get(
        `SolicitudCompraDetalle/AddProductoToSolicitudDto/${this.solicitudCompraId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.products = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    this.form.patchValue({
      solicitudCompraId: this.solicitudCompraId,
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });
    // this.onSelectProduct(this.form.get('productName')?.value);
    this.dataService
      .post<any>(`SolicitudCompraDetalle/`, this.form.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onUpdateData();
          this.onLoadProduct();
          this.form.reset();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  productSelect: string = '';

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

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    productoId: [],
    productName: ['', Validators.required],
    cantidad: [0, Validators.required],
    unidadMedidaId: ['', Validators.required],
    solicitudCompraId: [],
    employeeId: [],
  });
  public onSelectProduct(e: any): void {
    let find = this.products.find((x) => x?.producto === e.target.value);
    this.form.patchValue({
      productoId: find?.productoId,
    });
  }
}
