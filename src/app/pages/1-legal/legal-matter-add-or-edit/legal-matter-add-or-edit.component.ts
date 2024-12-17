import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { LuxuryAppService } from 'src/app/core/services/luxury-app.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-legal-matter-add-or-edit',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './legal-matter-add-or-edit.component.html',
  providers: [LuxuryAppService],
})
export default class LegalMatterCategoryComponent {
  appService = inject(LuxuryAppService);
  formBuilder = inject(FormBuilder);

  id: string = '';
  submitting: boolean = false;
  cb_resposanbles: ISelectItem[] = [
    {
      value: true,
      label: 'Interno',
    },
    {
      value: false,
      label: 'Externo',
    },
  ];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    legalMatterCategoryId: [''],
    legalMatterCategory: ['', [Validators.required, Validators.maxLength(100)]],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    isInternal: [true],
  });

  ngOnInit(): void {
    this.onCategories();
    this.id = this.appService.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `LegalMatter/${this.id}`;
    this.appService.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  cb_categories: ISelectItem[] = [];

  onCategories() {
    const urlApi = `LegalMatter/Categories`;
    this.appService.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_categories = result;
    });
  }
  onSubmit() {
    if (!this.appService.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.appService.apiRequestService
        .onPost(`LegalMatter`, this.form.value)
        .then((result: boolean) => {
          result ? this.appService.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.appService.apiRequestService
        .onPut(`LegalMatter/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.appService.ref.close(true) : (this.submitting = false);
        });
    }
  }

  // Método para validar si la categoría seleccionada ya existe o es nueva
  saveCategorie(event: any) {
    const inputCategory = event.target.value;

    // Verificar si la categoría ingresada ya existe en la lista
    const existingCategory = this.cb_categories.find(
      (category) => category.label.toLowerCase() === inputCategory.toLowerCase()
    );

    if (existingCategory) {
      // Si la categoría ya existe, establecer el valor en el formulario
      this.form.get('legalMatterCategoryId')?.setValue(existingCategory.value);
      this.form.get('legalMatterCategory')?.setValue(existingCategory.label);
    } else {
      // Si la categoría no existe, configurar el valor del formulario para enviarlo como nuevo
      this.form.get('legalMatterCategory')?.setValue(inputCategory);
      this.form.get('legalMatterCategoryId')?.setValue(null); // Dejar en blanco para indicar que es nueva
    }
  }
}
