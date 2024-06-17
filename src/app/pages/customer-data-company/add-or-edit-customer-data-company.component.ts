import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'add-or-edit-customer-data-company',
  templateUrl: './add-or-edit-customer-data-company.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditCustomerDataCompanyComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;

  cb_profession: ISelectItem[] = [];
  cb_applicationUser: ISelectItem[] = [];
  cb_customer: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [''],
    customer: [''],
    professionId: [''],
    profession: [''],
    phoneNumberPrefix: [''],
    applicationUserId: [''],
    applicationUser: [''],
    email: ['', Validators.email],
    phoneNumber: [''],
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `CustomerDataCompany/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem('customers')
      .then((items: ISelectItem[]) => {
        this.cb_customer = items;
      });
    this.apiRequestService
      .onGetSelectItem('Professions')
      .then((resp: ISelectItem[]) => {
        this.cb_profession = resp;
      });
    this.apiRequestService
      .onGetSelectItem('ApplicationUser')
      .then((resp: ISelectItem[]) => {
        this.cb_applicationUser = resp;
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;
    console.log('🚀 ~ this.form.value:', this.form.value);

    if (this.id === '') {
      this.apiRequestService
        .onPost(`CustomerDataCompany`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`CustomerDataCompany/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  saveCustomer(e): void {
    let find = this.cb_customer.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      customerId: find?.value,
      customer: find?.label,
    });
  }
  saveProfession(e): void {
    let find = this.cb_profession.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      professionId: find?.value,
      profession: find?.label,
    });
  }

  saveApplicationUser(e): void {
    let find = this.cb_applicationUser.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      applicationUserId: find?.value,
      applicationUser: find?.label,
    });
  }
}
