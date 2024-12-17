import { Component, inject, type OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-customer-provider',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, ReactiveFormsModule],

  templateUrl: './addoredit-customer-provider.component.html',
})
export default class AddOrEditCustomerProviderComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  cb_providers: ISelectItem[] = [];
  cb_categories: ISelectItem[] = [];
  customerId: number = this.customerIdService.customerId;

  submitting: boolean = false;

  id: string = '';
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.onLoadSelectItem();
    this.onLoadForm();
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`customerprovider/getById/${this.config.data.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  // Controles de Formulario

  form: FormGroup;

  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerId, Validators.required],
      providerId: ['', Validators.required],
      providerName: ['', Validators.required],
      categoryId: ['', Validators.required],
      categoryName: ['', Validators.required],
    });
  }

  onLoadSelectItem() {
    // Carga de listado de proveedores

    this.apiRequestService
      .onGetSelectItem(`providers`)
      .then((response: any) => {
        this.cb_providers = response;
      });

    // Carga de listado de categorias

    this.apiRequestService
      .onGetSelectItem(`categories`)
      .then((response: any) => {
        this.cb_categories = response;
      });
  }

  submit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`customerprovider`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`customerprovider/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  saveProviderId(e: any) {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
      providerName: find?.label,
    });
  }
  saveCategoryId(e: any) {
    let find = this.cb_categories.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      categoryId: find?.value,
      categoryName: find?.label,
    });
  }
}
