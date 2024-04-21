import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-inspection-to-recorrido',
  templateUrl: './add-or-edit-inspection-to-recorrido.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditInspectionToRecorridoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);

  ref = inject(DynamicDialogRef);
  customerAmenitiesCatalogId: string = this.config.data.id;
  submitting: boolean = false;

  cb_catalogInspection: any[] = [];

  form: FormGroup = this.formBuilder.group({
    customerAmenitiesCatalogId: [this.config.data.id],
    catalogInspectionId: [''],
    inspeccion: [''],
  });

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(`catalogInspection/${this.customerAmenitiesCatalogId}`)
      .then((result: any) => {
        this.cb_catalogInspection = result;
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestService
      .onPost(`cataloginspection/pushinpection`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  public saveInspectionId(e): void {
    let find = this.cb_catalogInspection.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      catalogInspectionId: find?.value,
    });
  }
}
