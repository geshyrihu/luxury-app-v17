import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-inspection-reviews-catalog-addoredit',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    templateUrl: './inspection-reviews-catalog-addoredit.component.html'
})
export default class InspectionReviewsCatalogAddoreditComponent
  implements OnInit
{
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    description: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `InspectionReviewsCatalog/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`InspectionReviewsCatalog`, this.form.value)
        .then((responseData: any) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`InspectionReviewsCatalog/${this.id}`, this.form.value)
        .then((responseData: any) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
