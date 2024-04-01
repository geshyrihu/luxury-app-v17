import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICustomerAddOrEdit } from 'src/app/core/interfaces/customer-add-or-edit.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-clientes',
  templateUrl: './addoredit-clientes.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditClienteComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  public dateService = inject(DateService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  optionActive: ISelectItem[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  urlBaseImg = `${environment.base_urlImg}Administration/customer/`;
  model: ICustomerAddOrEdit;
  photoFileUpdate: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    active: [''],
    nameCustomer: ['', [Validators.required, Validators.minLength(5)]],
    nombreCorto: ['', Validators.required],
    numeroCliente: ['', Validators.required],
    phoneOne: ['', Validators.required],
    phoneTwo: ['', Validators.required],
    photoPath: [''],
    register: [new Date(), Validators.required],
    rfc: ['', Validators.required],
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
    this.apiRequestService
      .onGetItem<ICustomerAddOrEdit>(`Customers/${this.id}`)
      .then((result: any) => {
        this.model = result;
        const register = this.dateService.getDateFormat(result.register);
        this.model.register = register;
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost('Customers', formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Customers/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  private createFormData(
    customerAdCustomerAddOrEdit: ICustomerAddOrEdit
  ): FormData {
    const formData = new FormData();
    formData.append('active', String(customerAdCustomerAddOrEdit.active));
    formData.append('adreess', customerAdCustomerAddOrEdit.adreess);
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
      this.dateService.getDateFormat(customerAdCustomerAddOrEdit.register)
    );
    formData.append('rfc', customerAdCustomerAddOrEdit.rfc);
    formData.append('numeroCliente', customerAdCustomerAddOrEdit.numeroCliente);
    return formData;
  }
}
