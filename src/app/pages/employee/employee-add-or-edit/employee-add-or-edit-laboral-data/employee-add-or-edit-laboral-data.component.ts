import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { EEducationLevel } from 'src/app/core/enums/education-level.enum';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';

@Component({
  selector: 'employee-add-or-edit-laboral-data',
  templateUrl: './employee-add-or-edit-laboral-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeAddOrEditLaboralDataComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);

  @Input() applicationUserId: string = '';

  cb_type_contract = onGetSelectItemFromEnum(ETypeContract);
  cb_education_level = onGetSelectItemFromEnum(EEducationLevel);

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
    typeContract: ['', Validators.required],
    salary: ['', Validators.required],
    educationLevel: ['', Validators.required],

    applicationUserId: [],
  });

  ngOnInit(): void {
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
  }
  onLoadData() {
    const urlApi = `ApplicationUserEmployee/LaboralData/${this.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestService
      .onPut(
        `ApplicationUserEmployee/UpdateLaboralData/${this.applicationUserId}`,
        this.form.value
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting = false;
      });
  }
}
