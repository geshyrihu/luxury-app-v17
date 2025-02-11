import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-unidad-medida',
  templateUrl: './addoredit-unidad-medida.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditUnidadMedidaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    descripcion: [
      '',
      {
        validators: [Validators.required],
      },
    ],
    user: '',
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`UnidadMedida/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`UnidadMedida`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`UnidadMedida/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
