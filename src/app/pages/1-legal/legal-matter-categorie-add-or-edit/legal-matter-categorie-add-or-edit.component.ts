import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { LuxuryAppService } from 'src/app/core/services/luxury-app.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-legal-matter-categorie-add-or-edit',
  templateUrl: './legal-matter-categorie-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [LuxuryAppService],
})
export default class LegalMatterCategorieAddOrEditComponent {
  appService = inject(LuxuryAppService);
  formBuilder = inject(FormBuilder);

  id: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.id = this.appService.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `LegalMatter/Category/${this.id}`;
    this.appService.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    console.log('🚀 ~ this.form.value:', this.form.value);
    if (!this.appService.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.appService.apiRequestService
        .onPost(`LegalMatter/Category`, this.form.value)
        .then((result: boolean) => {
          result ? this.appService.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.appService.apiRequestService
        .onPut(`LegalMatter/Category/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.appService.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
