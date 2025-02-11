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
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  cb_measurementUnits: any = [];
  // stokMaximo: 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdS.customerId, Validators.required],
    productoId: ['', Validators.required],
    producto: [''],
    existencia: [0, Validators.required],
    unidadDeMedidaId: ['', Validators.required],
    stockMin: [0, Validators.required],
    stockMax: [0, Validators.required],
    applicationUserId: [this.authS.applicationUserId],
  });

  onLoadProducts() {
    this.apiRequestS
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_measurementUnits = response;
      });
  }

  ngOnInit(): void {
    this.onLoadProducts();
    this.id = this.config.data.id;

    if (this.id !== 0) this.onLoadData();
  }

  // convenience getter for easy access to form fields

  onLoadData() {
    const urlApi = `InventarioProducto/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    if (this.id === 0) {
      this.apiRequestS
        .onPost(`InventarioProducto`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`InventarioProducto/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
