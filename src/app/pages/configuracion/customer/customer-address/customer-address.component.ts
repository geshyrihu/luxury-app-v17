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
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;
  customerId: number = 0;

  form: FormGroup = this.formBuilder.group({
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
    this.apiRequestService
      .onGetItem(`customers/customeraddress/${this.customerId}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.apiRequestService
      .onPut(`customers/updatecustomeraddress`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
