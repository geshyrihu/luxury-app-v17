import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-legal-matter-categorie-add-or-edit',
  templateUrl: './legal-matter-categorie-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [],
})
export default class LegalMatterCategorieAddOrEditComponent {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `LegalMatter/Category/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`LegalMatter/Category`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`LegalMatter/Category/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
