import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-edit-productos-almacen',
  templateUrl: './edit-productos-almacen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EditProductosAlmacenComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  cb_measurementUnits: any = [];
  // stokMaximo: 0;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.customerId, Validators.required],
    productoId: ['', Validators.required],
    producto: [''],
    existencia: [0, Validators.required],
    unidadDeMedidaId: ['', Validators.required],
    stockMin: [0, Validators.required],
    stockMax: [0, Validators.required],
    personId: [this.authService.personId],
  });

  onLoadProducts() {
    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_measurementUnits = response;
      });
  }

  ngOnInit(): void {
    console.log('🚀 ~ this.authService.personId:', this.authService.personId);
    this.onLoadProducts();
    this.id = this.config.data.id;

    if (this.id !== 0) this.onLoadData();
  }

  // convenience getter for easy access to form fields

  onLoadData() {
    const urlApi = `InventarioProducto/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    console.log('🚀 ~ this.form.value:', this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`InventarioProducto`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`InventarioProducto/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
