import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { EMaritalStatus } from 'src/app/core/enums/marital.status';
import { ECountry } from 'src/app/core/enums/paises.enum';
import { ESex } from 'src/app/core/enums/sex.enum';
import { EBloodType } from 'src/app/core/enums/tipo-sangre';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';

@Component({
  selector: 'employee-add-or-edit-personal-data',
  templateUrl: './employee-add-or-edit-personal-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeAddOrEditPersonalDataComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  formBuilder = inject(FormBuilder);

  @Input() employeeId: string = '';

  cb_blood_type = onGetSelectItemFromEnum(EBloodType);
  cb_marital_status = onGetSelectItemFromEnum(EMaritalStatus);
  cb_nationality = ECountry.GetEnum();
  cb_sex = onGetSelectItemFromEnum(ESex);

  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    // Person data
    birth: ['', Validators.required],
    bloodType: ['', Validators.required],
    curp: ['', Validators.required],
    localPhone: ['', Validators.required],
    maritalStatus: ['', Validators.required],
    nationality: ['', Validators.required],
    nss: ['', Validators.required],
    rfc: ['', Validators.required],
    sex: ['', Validators.required],
  });

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `ApplicationUserEmployee/PersonalData/${this.employeeId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestService
      .onPut(
        `ApplicationUserEmployee/UpdatePersonalData/${this.employeeId}`,
        this.form.value
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting = false;
      });
  }
}
