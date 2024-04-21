import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-customer-amenities-catalog',
  templateUrl: './add-or-edit-customer-amenities-catalog.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditCustomerAmenitiesCatalogComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  amenitiescatalogid = this.config.data.amenitiescatalogid;
  customerId = this.config.data.customerId;
  submitting: boolean = false;
  cb_residentialLocations: any[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: '', disabled: true },
    number: ['', [Validators.required, Validators.maxLength(3)]],
    customerId: [this.customerId, Validators.required],
    amenitiesCatalogId: [this.amenitiescatalogid, Validators.required],
    residentialLocations: [],
    residentialLocationsId: ['', Validators.required],
  });

  ngOnInit() {
    console.log('data: ', this.config.data);
    this.onLoadLocations();
  }

  onLoadLocations() {
    this.apiRequestService
      .onGetSelectItem(`residentiallocations`)
      .then((result: any) => {
        this.cb_residentialLocations = result;
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    console.log('form', this.form.value);
    this.submitting = true;

    const urlApi = `customeramenitiescatalog/addamenitiescatalog`;
    this.apiRequestService
      .onPost(urlApi, this.form.value)
      .then((result: any) => {
        result ? this.ref.close(result) : (this.submitting = false);
      });
  }
  public saveToolId(e): void {
    let find = this.cb_residentialLocations.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      residentialLocationsId: find?.value,
    });
  }
}
