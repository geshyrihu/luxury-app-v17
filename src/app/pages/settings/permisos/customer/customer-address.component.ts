import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CustomerAddressComponent implements OnInit {
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiRequestS = inject(ApiRequestService);

  submitting: boolean = false;
  customerId: number = 0;

  form: FormGroup = this.formB.group({
    id: [],
    customerId: ['', Validators.required],
    additionalDetails: [''],
    city: ['', Validators.required],
    district: ['', Validators.required],
    country: ['', Validators.required],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    number: ['', Validators.required],
    postalCode: ['', Validators.required],
    street: ['', Validators.required],
    townHall: ['', Validators.required],
    unitNumber: [],
  });
  ngOnInit(): void {
    this.customerId = this.config.data.customerId;
    if (this.customerId !== 0) this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`customers/customeraddress/${this.customerId}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestS
      .onPut(`customers/updatecustomeraddress`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
