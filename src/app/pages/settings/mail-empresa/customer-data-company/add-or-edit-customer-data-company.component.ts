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
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;

  cb_profession: ISelectItem[] = [];
  cb_applicationUser: ISelectItem[] = [];
  cb_customer: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
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
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem('CustomersActive')
      .then((items: ISelectItem[]) => {
        this.cb_customer = items;
      });
    this.apiRequestS
      .onGetSelectItem('Professions')
      .then((resp: ISelectItem[]) => {
        this.cb_profession = resp;
      });
    this.apiRequestS
      .onGetSelectItem('ApplicationUser')
      .then((resp: ISelectItem[]) => {
        this.cb_applicationUser = resp;
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`CustomerDataCompany`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`CustomerDataCompany/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
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
