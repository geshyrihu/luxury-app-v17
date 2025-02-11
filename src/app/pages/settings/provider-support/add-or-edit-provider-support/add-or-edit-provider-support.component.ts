import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-provider-support',
  templateUrl: './add-or-edit-provider-support.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditProviderSupportComponent {
  private config = inject(DynamicDialogConfig);
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  id: string = '';

  cb_applicationUserProvider: ISelectItem[] = [];
  cb_professions: ISelectItem[] = [];
  cb_providers: ISelectItem[] = [];
  cb_customers: ISelectItem[] = [];

  // TODO: AGREGAR FUNCIONALIDA DE CARGA DE LISTAS

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    applicationUserId: ['', [Validators.required]],
    applicationUser: ['', [Validators.required]],
    providerId: ['', [Validators.required]],
    nameProvider: ['', [Validators.required]],
    professionId: ['', [Validators.required]],
    nameProfession: ['', [Validators.required]],
    customerId: ['', [Validators.required]],
    nameCustomer: ['', [Validators.required]],
  });

  ngOnInit() {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`providersupport/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`providersupport`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`providersupport/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadSelectItem() {
    // Carga de listado de proveedores
    this.apiRequestS.onGetSelectItem('providers').then((resp: any) => {
      this.cb_providers = resp;
    });

    // Carga de listado de categorias
    this.apiRequestS.onGetSelectItem('professions').then((resp: any) => {
      this.cb_professions = resp;
    });

    // Carga de listado de ApplicationUser
    this.apiRequestS
      .onGetSelectItem('ApplicationUserProvider')
      .then((resp: any) => {
        this.cb_applicationUserProvider = resp;
      });

    // Carga de listado de clientes
    this.apiRequestS.onGetSelectItem('customers').then((resp: any) => {
      this.cb_customers = resp;
    });
  }

  saveProviderId(e: any) {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
      nameProvider: find?.label,
    });
  }
  saveProfessionsId(e: any) {
    let find = this.cb_professions.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
      nameProfession: find?.label,
    });
  }
  saveApplicationUserId(e: any) {
    let find = this.cb_applicationUserProvider.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      applicationUserId: find?.value,
      applicationUser: find?.label,
    });
  }

  saveCustomerId(e: any) {
    let find = this.cb_customers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      customerId: find?.value,
      nameCustomer: find?.label,
    });
  }
}
