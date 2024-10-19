import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';

@Component({
  selector: 'employee-add-or-edit-adreess',
  templateUrl: './employee-add-or-edit-adreess.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeAddOrEditAdreessComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);

  @Input() employeeId: string = '';

  addressId: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: [''],
    city: ['', [Validators.required, Validators.maxLength(20)]],
    district: ['', [Validators.required, Validators.maxLength(60)]],
    townHall: ['', [Validators.required, Validators.maxLength(20)]],
    number: ['', Validators.required],
    unitNumber: ['', [Validators.required, Validators.maxLength(20)]],
    street: ['', [Validators.required, Validators.maxLength(60)]],
    zipCode: ['', [Validators.required, Validators.maxLength(10)]],
  });

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `ApplicationUserEmployee/AddressData/${this.employeeId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      this.addressId = result.id;
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    const urlApi = `ApplicationUserEmployee/UpdateAddressData/${this.addressId}`;
    this.apiRequestService
      .onPut(urlApi, this.form.value)
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting = false;
      });
  }
}
