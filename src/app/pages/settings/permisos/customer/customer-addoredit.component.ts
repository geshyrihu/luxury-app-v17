import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ICustomerAddOrEdit } from 'src/app/core/interfaces/customer-add-or-edit.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-customer-addoredit',
    templateUrl: './customer-addoredit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class CustomerAddOrEditComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  optionActive: ISelectItem[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  model: ICustomerAddOrEdit;
  photoFileUpdate: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    active: [''],
    nameCustomer: ['', [Validators.required, Validators.minLength(5)]],
    nombreCorto: ['', Validators.required],
    numeroCliente: ['', Validators.required],
    phoneOne: [''],
    phoneTwo: [''],
    photoPath: [''],
    register: [new Date(), Validators.required],
    rfc: ['', Validators.required],
    folioPrefix: ['', Validators.maxLength(5)],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem<ICustomerAddOrEdit>(`Customers/${this.id}`)
      .then((responseData: any) => {
        this.model = responseData;
        const register = this.dateS.getDateFormat(responseData.register);
        this.model.register = register;
        this.form.patchValue(responseData);
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost('Customers', formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Customers/${this.id}`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  private createFormData(
    customerAdCustomerAddOrEdit: ICustomerAddOrEdit
  ): FormData {
    const formData = new FormData();
    formData.append('active', String(customerAdCustomerAddOrEdit.active));
    formData.append('adreess', customerAdCustomerAddOrEdit.adreess);
    formData.append('folioPrefix', customerAdCustomerAddOrEdit.folioPrefix);
    formData.append('nameCustomer', customerAdCustomerAddOrEdit.nameCustomer);
    formData.append('nombreCorto', customerAdCustomerAddOrEdit.nombreCorto);
    formData.append('phoneOne', customerAdCustomerAddOrEdit.phoneOne);
    formData.append('phoneTwo', customerAdCustomerAddOrEdit.phoneTwo);
    formData.append('longitud', customerAdCustomerAddOrEdit.longitud);
    formData.append('latitud', customerAdCustomerAddOrEdit.latitud);
    if (customerAdCustomerAddOrEdit.photoPath) {
      formData.append('photoPath', customerAdCustomerAddOrEdit.photoPath);
    }
    formData.append(
      'register',
      this.dateS.getDateFormat(customerAdCustomerAddOrEdit.register)
    );
    formData.append('rfc', customerAdCustomerAddOrEdit.rfc);
    formData.append('numeroCliente', customerAdCustomerAddOrEdit.numeroCliente);
    return formData;
  }
}
