import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-medidor-categoria',
    templateUrl: './addoredit-medidor-categoria.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class FormMedidorCategoriaComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    nombreMedidorCategoria: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`MedidorCategoria/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    // this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`MedidorCategoria`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`MedidorCategoria/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
