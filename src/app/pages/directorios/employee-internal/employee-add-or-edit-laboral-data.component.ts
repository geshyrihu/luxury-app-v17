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
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class EmployeeAddOrEditLaboralDataComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  enumSelectService = inject(EnumSelectService);
  formBuilder = inject(FormBuilder);

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

  form: FormGroup = this.formBuilder.group({
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
    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });

    this.apiRequestService
      .onGetSelectItem(`Customers`)
      .then((response: any) => {
        this.cb_customer = response;
      });

    flatpickrFactory();
    this.onLoadData();
    this.cb_type_contract = await this.enumSelectService.typeContract();
    this.cb_education_level = await this.enumSelectService.educationLevel();
  }
  onLoadData() {
    const urlApi = `EmployeeInternal/LaboralData/${this.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestService
      .onPut(
        `EmployeeInternal/UpdateLaboralData/${this.applicationUserId}`,
        this.form.value
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting = false;
      });
  }
}
