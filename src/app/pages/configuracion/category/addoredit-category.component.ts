import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategoryAddOrEditDto } from 'src/app/core/interfaces/ICategoryAddOrEditDto.interface';
import { ApiRequestService } from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-category',
  templateUrl: './addoredit-category.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditCategoryComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;

  id: any = 0;
  form: FormGroup = this.formBuilder.group({
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
    this.apiRequestService
      .onGetItem<ICategoryAddOrEditDto>(`Categories/${this.id}`)
      .then((result: ICategoryAddOrEditDto) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Categories`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Categories/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
