import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ERelationEmployee } from 'src/app/core/enums/relation-employee.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-employee-emergency-contact-add-or-edit',
  templateUrl: './employee-emergency-contact-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeEmergencyContactAddOrEditComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;
  cb_relacion: ISelectItem[] = onGetSelectItemFromEnum(ERelationEmployee);

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    employeeId: [this.config.data.employeeId],
    nameContact: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    relation: ['', Validators.required],
    contacOfBeneficiary: [this.config.data.contacOfBeneficiary],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;

    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `EmployeeEmergencyContact/${this.id}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`EmployeeEmergencyContact`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`EmployeeEmergencyContact/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
