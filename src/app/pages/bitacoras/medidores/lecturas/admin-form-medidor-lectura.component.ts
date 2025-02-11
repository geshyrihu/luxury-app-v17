import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-admin-form-medidor-lectura',
  templateUrl: './admin-form-medidor-lectura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AdminFormMedidorLecturaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);

  submitting: boolean = false;

  id: number = 0;
  ultimaLectura: number = 0;
  medidorId: number = 0;
  form: FormGroup;
  today: string = new Date().toISOString().slice(0, 16);

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.medidorId = this.config.data.medidorId;

    if (this.id !== 0) this.onLoadData();

    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      medidorId: [this.medidorId],
      fechaRegistro: [this.today, Validators.required],
      lectura: ['', Validators.required],
      applicationUserId: [this.authS.applicationUserId],
    });
  }
  onLoadData() {
    const urlApi = `MedidorLectura/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (this.form.value.lectura == 0) return;
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`MedidorLectura`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`MedidorLectura/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
