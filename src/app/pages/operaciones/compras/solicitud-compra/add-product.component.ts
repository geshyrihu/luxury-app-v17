import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import TarjetaProductoComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AddProductComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public selectItemService = inject(SelectItemService);
  private formBuilder = inject(FormBuilder);
  private solicitudCompraService = inject(SolicitudCompraService);

  id: any = 0;
  products: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  ref: DynamicDialogRef;
  subRef$: Subscription;

  @Input()
  solicitudCompraId: number = 0;
  cb_measurement_units: ISelectItemDto[] = [];

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
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_measurement_units = resp;
      });
  }

  onLoadProduct() {
    this.subRef$ = this.dataService
      .get(
        `SolicitudCompraDetalle/AddProductoToSolicitudDto/${this.solicitudCompraId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.products = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
    this.form.patchValue({
      solicitudCompraId: this.solicitudCompraId,
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });
    // this.onSelectProduct(this.form.get('productName')?.value);
    this.subRef$ = this.dataService
      .post<any>(`SolicitudCompraDetalle/`, this.form.value)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onUpdateData();
          this.onLoadProduct();
          this.form.reset();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
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
