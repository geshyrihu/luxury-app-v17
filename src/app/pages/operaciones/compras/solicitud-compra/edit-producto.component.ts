import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ValidationErrorsCustomInputComponent from 'src/app/custom-components/custom-input-form/validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
  templateUrl: './edit-producto.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CustomInputModule,
    ValidationErrorsCustomInputComponent,
  ],
})
export default class EditProductoComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authService = inject(AuthService);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: any = 0;
  data: any;
  solicitudCompraId: number = 0;
  cb_unidadMedida: ISelectItem[] = [];
  cb_Productos: ISelectItem[] = [];
  form: FormGroup;
  nombreProducto = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });

    this.apiRequestService
      .onGetSelectItem('GetProducts')
      .then((response: any) => {
        this.cb_Productos = response;
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
      unidadMedidaId: ['', Validators.required],
      applicationUserId: [
        this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
        { validators: [Validators.required] },
      ],
    });
  }

  onLoadProduct() {
    this.dataService
      .get<any>(`SolicitudCompraDetalle/EditProduct/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.nombreProducto = resp.body.nombreProducto;
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.data.cantidad = this.form.get('cantidad').value;
    this.data.unidadMedidaId = this.form.get('unidadMedidaId').value;
    this.data.solicitudCompraId = this.form.get('solicitudCompraId').value;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .put<any>(`SolicitudCompraDetalle/${this.id}`, this.data)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
