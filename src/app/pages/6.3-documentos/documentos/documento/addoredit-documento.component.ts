import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-documento',
  templateUrl: './addoredit-documento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditDocumentoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  authS = inject(AuthService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;
  checked: boolean = false;
  cb_categoriaDocumento: boolean = true;
  urlBaseImg = environment.base_urlImg;
  model: any;
  filteredProvider: any[];
  selectedProvider: any;
  file: File;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getCustomerId(), Validators.required],
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
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue({
        id: result.id,
        customerId: result.customerId,
        document: '',
        categoriaDocumento: result.categoriaDocumento,
        nameDocument: result.nameDocument,
      });
    });
  }
  submit() {
    let formData = this.createModel(this.form);

    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`DocumentoCustomer`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`DocumentoCustomer/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
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
