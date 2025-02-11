import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-edit-detalle',
  templateUrl: './orden-compra-edit-detalle.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraEditDetalleComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;

  id: number = 0;

  cb_unidadMedida: any[] = [];
  form: FormGroup = this.formB.group({
    id: { value: this.config.data.id, disabled: true },
    ordenCompraId: ['', Validators.required],
    productoId: ['', Validators.required],
    cantidad: ['', Validators.required],
    unidadMedidaId: ['', Validators.required],
    precio: ['', Validators.required],
    descuento: ['', Validators.required],
    ivaAplicado: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onSelectItem();
    if (this.id !== 0) this.onLoadData();
  }

  onSelectItem() {
    this.apiRequestS
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`OrdenCompraDetalle/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestS
      .onPut(`OrdenCompraDetalle/${this.id}`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
