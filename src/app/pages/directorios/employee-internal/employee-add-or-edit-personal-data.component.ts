import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ECountry } from 'src/app/core/enums/paises.enum';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';

@Component({
  selector: 'employee-add-or-edit-personal-data',
  templateUrl: './employee-add-or-edit-personal-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class EmployeeAddOrEditPersonalDataComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  enumSelectS = inject(EnumSelectService);

  @Input() employeeId: string = '';

  cb_blood_type: ISelectItem[] = [];
  cb_marital_status: ISelectItem[] = [];
  cb_nationality: ISelectItem[] = ECountry.GetEnum();
  cb_sex: ISelectItem[] = [];

  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    // Person data
    birth: ['', Validators.required],
    bloodType: [null, Validators.required],
    curp: ['', Validators.required],
    localPhone: ['', Validators.required],
    maritalStatus: [null, Validators.required],
    nationality: ['', Validators.required],
    nss: ['', Validators.required],
    rfc: ['', Validators.required],
    sex: [null, Validators.required],
  });

  async ngOnInit() {
    await this.onLoadEmun();
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `EmployeeInternal/PersonalData/${this.employeeId}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  async onLoadEmun() {
    this.cb_blood_type = await this.enumSelectS.bloodType();
    this.cb_marital_status = await this.enumSelectS.maritalStatus();
    this.cb_nationality = ECountry.GetEnum();
    this.cb_sex = await this.enumSelectS.sex();
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestS
      .onPut(
        `EmployeeInternal/UpdatePersonalData/${this.employeeId}`,
        this.form.value
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting = false;
      });
  }
}
