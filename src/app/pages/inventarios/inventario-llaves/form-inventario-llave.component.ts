import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-form-inventario-llave',
    templateUrl: './form-inventario-llave.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class FormInventarioLlaveComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);

  submitting: boolean = false;

  id: number = 0;

  cb_equipoClasificacion: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdS.getCustomerId(), [Validators.required]],
    descripcion: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    numeroLlave: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
    equipoClasificacionId: ['', [Validators.required]],
    applicationUserId: [this.authS.applicationUserId, [Validators.required]],
  });

  ngOnInit() {
    this.onLoadEquipoClasificacion();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `InventarioLlave/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`InventarioLlave`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`InventarioLlave/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadEquipoClasificacion() {
    const urlApi = 'EquipoClasificacion/SelectItem';
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_equipoClasificacion = responseData;
    });
  }
}
