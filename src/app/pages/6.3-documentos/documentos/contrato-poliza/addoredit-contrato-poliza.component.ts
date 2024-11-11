import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-contrato-poliza',
  templateUrl: './addoredit-contrato-poliza.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditContratoPolizaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);

  ref = inject(DynamicDialogRef);
  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = environment.base_urlImg;
  model: any;
  cb_providers: ISelectItem[] = [];
  file: File;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    providerId: ['', Validators.required],
    providerName: ['', Validators.required],
    customerId: [this.customerIdService.getCustomerId(), Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    document: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;

    this.apiRequestService
      .onGetSelectItem(`Providers`)
      .then((response: any) => {
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
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
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

    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`ContratoPoliza`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
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
      this.dateService.getDateFormat(form.get('startDate').value)
    );
    formData.append(
      'endDate',
      this.dateService.getDateFormat(form.get('endDate').value)
    );
    return formData;
  }
}
