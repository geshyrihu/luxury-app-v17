import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETypePerson } from 'src/app/core/enums/type-person.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-application-user',
  templateUrl: './add-or-edit-application-user.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditApplicationUserComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  applicationUserId: string = '';
  cb_customer: ISelectItem[] = [];
  cb_typePerson: ISelectItem[] = onGetSelectItemFromEnum(ETypePerson);

  form: FormGroup = this.formBuilder.group({
    email: [''],
    phoneNumber: [''],
    customerId: ['', Validators.required],
    typePerson: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  ngOnInit() {
    this.onLoadSelectItem();
    this.applicationUserId = this.config.data.applicationUserId;
    if (this.applicationUserId !== '') this.onLoadData();
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem('customers')
      .then((items: ISelectItem[]) => {
        this.cb_customer = items;
      });
  }

  onLoadData() {
    const urlApi = `Auth/${this.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestService
      .onPut(`Auth/EditAccount/${this.applicationUserId}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
