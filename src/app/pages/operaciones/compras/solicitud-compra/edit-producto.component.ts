import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  templateUrl: './edit-producto.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class EditProductoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: any = 0;
  data: any;
  solicitudCompraId: number = 0;
  cb_unidadMedida: ISelectItemDto[] = [];
  cb_Productos: ISelectItemDto[] = [];
  form: FormGroup;
  nombreProducto = '';
  subRef$: Subscription;

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_unidadMedida = resp;
      });
    this.selectItemService.onGetSelectItem('GetProducts').subscribe((resp) => {
      this.cb_Productos = resp;
    });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();

    this.id = this.config.data.id;
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.onLoadProduct();
    this.form = this.formBuilder.group({
      id: [0],
      solicitudCompraId: [
        this.config.data.solicitudCompraId,
        { validators: [Validators.required] },
      ],
      productoId: [0, { validators: [Validators.required] }],
      nombreProducto: [],
      cantidad: [0, { validators: [Validators.required] }],
      unidadMedidaId: [0, { validators: [Validators.required] }],
      applicationUserId: [
        this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
        { validators: [Validators.required] },
      ],
    });
  }

  onLoadProduct() {
    this.subRef$ = this.dataService
      .get<any>(`SolicitudCompraDetalle/EditProduct/${this.id}`)
      .subscribe((resp: any) => {
        this.data = resp.body;
        this.nombreProducto = resp.body.nombreProducto;
        this.form.patchValue(resp.body);
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    this.data.cantidad = this.form.get('cantidad').value;
    this.data.unidadMedidaId = this.form.get('unidadMedidaId').value;
    this.data.solicitudCompraId = this.form.get('solicitudCompraId').value;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put<any>(`SolicitudCompraDetalle/${this.id}`, this.data)
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
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
