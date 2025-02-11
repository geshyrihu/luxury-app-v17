import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-legal-matter-add-or-edit',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    templateUrl: './legal-matter-add-or-edit.component.html',
    providers: []
})
export default class LegalMatterCategoryComponent {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

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

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    legalMatterCategoryId: [''],
    legalMatterCategory: ['', [Validators.required, Validators.maxLength(100)]],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    isInternal: [true],
  });

  ngOnInit(): void {
    this.onCategories();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `LegalMatter/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  cb_categories: ISelectItem[] = [];

  onCategories() {
    const urlApi = `LegalMatter/Categories`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_categories = responseData;
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`LegalMatter`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`LegalMatter/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
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
