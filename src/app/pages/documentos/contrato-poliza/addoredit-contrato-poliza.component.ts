import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-contrato-poliza',
  templateUrl: './addoredit-contrato-poliza.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditContratoPolizaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  formB = inject(FormBuilder);

  ref = inject(DynamicDialogRef);
  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  model: any;
  cb_providers: ISelectItem[] = [];
  file: File;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    providerId: ['', Validators.required],
    providerName: ['', Validators.required],
    customerId: [this.customerIdS.getCustomerId(), Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    document: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;

    this.apiRequestS.onGetSelectItem(`Providers`).then((response: any) => {
      this.cb_providers = response;
    });

    flatpickrFactory();
    if (this.id !== 0) this.onLoadData();
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadData() {
    const urlApi = `ContratoPoliza/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.id = result.id;
      this.form.patchValue(result);
      this.form.patchValue({
        providerId: result.providerId,
      });
      this.form.patchValue({
        providerName: result.providerName,
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
        .onPost(`ContratoPoliza`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`ContratoPoliza/${this.id}`, formData)
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

    formData.append('providerId', String(form.get('providerId').value));
    formData.append('customerId', String(form.get('customerId').value));
    formData.append('description', form.get('description').value);
    formData.append(
      'startDate',
      this.dateS.getDateFormat(form.get('startDate').value)
    );
    formData.append(
      'endDate',
      this.dateS.getDateFormat(form.get('endDate').value)
    );
    return formData;
  }
}
