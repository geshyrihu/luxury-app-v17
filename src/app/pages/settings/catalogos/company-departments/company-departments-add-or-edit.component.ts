import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-company-departments-add-or-edit',
  templateUrl: './company-departments-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class CompanyDepartmentsAddOrEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  id: number = 0;

  form: FormGroup;
  cb_area_empresa: ISelectItem[] = [];

  async ngOnInit() {
    this.cb_area_empresa = await this.enumSelectService.companyArea();
    this.onLoadForm();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  onLoadData(id: number) {
    const urlApi = `CompanyDepartment/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      nameArea: [null, [Validators.required, Validators.minLength(5)]],
      companyArea: [this.config.data.companyArea, [Validators.required]],
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`CompanyDepartment`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`CompanyDepartment/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
    // Mostrar un mensaje de carga
  }
}
