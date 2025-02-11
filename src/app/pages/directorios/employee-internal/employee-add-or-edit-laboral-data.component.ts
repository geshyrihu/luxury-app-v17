import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';

@Component({
    selector: 'employee-add-or-edit-laboral-data',
    templateUrl: './employee-add-or-edit-laboral-data.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class EmployeeAddOrEditLaboralDataComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  enumSelectS = inject(EnumSelectService);
  formB = inject(FormBuilder);

  @Input() applicationUserId: string = '';

  cb_type_contract = [];
  cb_education_level = [];

  cb_profession: ISelectItem[];
  cb_customer: ISelectItem[] = [];

  cb_state: ISelectItem[] = [
    {
      label: 'Activo',
      value: true,
    },
    {
      label: 'Inactivo',
      value: false,
    },
  ];

  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    // Person data
    dateAdmission: ['', Validators.required],
    professionId: [0, Validators.required],
    customerId: [0, Validators.required],
    active: ['', Validators.required],
    typePerson: ['', Validators.required],
    salary: ['', Validators.required],
    educationLevel: ['', Validators.required],

    applicationUserId: [],
  });

  async ngOnInit() {
    this.apiRequestS.onGetSelectItem(`Professions`).then((response: any) => {
      this.cb_profession = response;
    });

    this.apiRequestS.onGetSelectItem(`Customers`).then((response: any) => {
      this.cb_customer = response;
    });

    flatpickrFactory();
    this.onLoadData();
    this.cb_type_contract = await this.enumSelectS.typeContract();
    this.cb_education_level = await this.enumSelectS.educationLevel();
  }
  onLoadData() {
    const urlApi = `EmployeeInternal/LaboralData/${this.applicationUserId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestS
      .onPut(
        `EmployeeInternal/UpdateLaboralData/${this.applicationUserId}`,
        this.form.value
      )
      .then((responseData: any) => {
        this.form.patchValue(responseData);
        this.submitting = false;
      });
  }
}
