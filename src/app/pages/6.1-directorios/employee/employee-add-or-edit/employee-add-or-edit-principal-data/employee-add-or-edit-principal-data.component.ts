import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';

@Component({
  selector: 'employee-add-or-edit-principal-data',
  templateUrl: './employee-add-or-edit-principal-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeAddOrEditPrincipalDataComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  formBuilder = inject(FormBuilder);

  @Input()
  applicationUserId: string = '';

  submitting: boolean = false;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.applicationUserId, disabled: true },
    email: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ApplicationUserEmployee/PrincipalData/${this.applicationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    this.apiRequestService
      .onPut(
        `ApplicationUserEmployee/UpdatePrincipalData/${this.applicationUserId}`,
        this.form.value
      )
      .then((result: boolean) => {
        this.submitting = false;
      });
  }
}
