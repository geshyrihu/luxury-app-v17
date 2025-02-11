import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-employee-emergency-contact-add-or-edit',
    templateUrl: './employee-emergency-contact-add-or-edit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class EmployeeEmergencyContactAddOrEditComponent
  implements OnInit
{
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  id: string = '';
  submitting: boolean = false;
  cb_relacion: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    employeeId: [this.config.data.employeeId],
    nameContact: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    relation: [null, Validators.required],
    contacOfBeneficiary: [this.config.data.contacOfBeneficiary],
  });
  async ngOnInit() {
    this.cb_relacion = await this.enumSelectS.relationEmployee();

    this.id = this.config.data.id;

    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `EmployeeEmergencyContact/${this.id}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`EmployeeEmergencyContact`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`EmployeeEmergencyContact/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
