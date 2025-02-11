import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ValidationErrorsCustomInputComponent from 'src/app/custom-components/custom-input-form/validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
    templateUrl: './edit-producto.component.html',
    imports: [
        LuxuryAppComponentsModule,
        CustomInputModule,
        ValidationErrorsCustomInputComponent,
    ]
})
export default class EditProductoComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);

  submitting: boolean = false;

  id: any = 0;
  data: any;
  solicitudCompraId: number = 0;
  cb_unidadMedida: ISelectItem[] = [];
  form: FormGroup;
  nombreProducto = '';

  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();

    this.id = this.config.data.id;
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.onLoadProduct();
    this.form = this.formB.group({
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
        this.authS.applicationUserId,
        { validators: [Validators.required] },
      ],
    });
  }

  onLoadProduct() {
    this.apiRequestS
      .onGetItem(`solicitudcompradetalle/editproduct/${this.id}`)
      .then((responseData: any) => {
        this.data = responseData;
        this.nombreProducto = responseData.nombreProducto;
        this.form.patchValue(responseData);
      });
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.data.cantidad = this.form.get('cantidad').value;
    this.data.unidadMedidaId = this.form.get('unidadMedidaId').value;
    this.data.solicitudCompraId = this.form.get('solicitudCompraId').value;

    this.submitting = true;

    this.apiRequestS
      .onPut(`SolicitudCompraDetalle/${this.id}`, this.data)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
