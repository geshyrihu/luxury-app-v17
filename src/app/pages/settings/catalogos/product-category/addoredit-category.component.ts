import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategoryAddOrEdit } from 'src/app/core/interfaces/category-add-or-edit.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-category',
    templateUrl: './addoredit-category.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class AddOrEditCategoryComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    nameCotegory: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      },
    ],
    user: '',
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    const urlApi = `Categories/${this.id}`;
    this.apiRequestS
      .onGetItem(urlApi)
      .then((responseData: ICategoryAddOrEdit) => {
        this.form.patchValue(responseData);
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Categories`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Categories/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
