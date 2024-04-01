import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-create-account-customer',
  templateUrl: './create-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CreateAccountComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  cb_profession: ISelectItem[] = [];
  cb_customer: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    userName: ['', Validators.required],
    email: [''],
    phoneNumber: [''],
    professionId: ['', Validators.required],
    customerId: ['', Validators.required],
  });

  ngOnInit() {
    this.onLoadSelectItem();
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
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestService
      .onPost(`Auth/CreateAccount`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
