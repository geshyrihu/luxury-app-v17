import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-documento',
  templateUrl: './addoredit-documento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditDocumentoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;
  checked: boolean = false;
  cb_categoriaDocumento: boolean = true;
  model: any;
  filteredProvider: any[];
  selectedProvider: any;
  file: File;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdS.getCustomerId(), Validators.required],
    document: ['', Validators.required],
    categoriaDocumento: [true, Validators.required],
    nameDocument: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.onLoadData();
    }
  }
  onLoadData() {
    const urlApi = `documentocustomer/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue({
        id: responseData.id,
        customerId: responseData.customerId,
        document: '',
        categoriaDocumento: responseData.categoriaDocumento,
        nameDocument: responseData.nameDocument,
      });
    });
  }
  submit() {
    let formData = this.createModel(this.form);

    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`DocumentoCustomer`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`DocumentoCustomer/${this.id}`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  uploadFile(event) {
    this.file = event.target.files[0];
  }
  createModel(form: FormGroup): FormData {
    const formData = new FormData();
    if (this.file !== undefined) {
      formData.append('document', this.file);
    }
    formData.append('nameDocument', String(form.get('nameDocument').value));
    formData.append('customerId', String(form.get('customerId').value));
    formData.append(
      'categoriaDocumento',
      String(form.get('categoriaDocumento').value)
    );
    return formData;
  }

  get f() {
    return this.form.controls;
  }
}
