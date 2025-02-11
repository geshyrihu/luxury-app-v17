import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-presupuesto-edit-partida',
    templateUrl: './presupuesto-edit-partida.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class PresupuestoEditPartidaComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: any = 0;
  form: FormGroup;

  ngOnInit() {
    this.id = this.config.data.id;
    this.onLoadData();
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    this.form.patchValue({
      applicationUserId: this.authS.applicationUserId,
    });
    if (this.id === 0) {
      this.apiRequestS
        .onPost(`CedulaPresupuestalDetalles`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`CedulaPresupuestalDetalles/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onLoadData() {
    this.form = this.formB.group({
      id: [this.id],
      cuentaId: [0],
      cedulaPresupuestalId: [''],
      descripcion: [''],
      presupuestoMensual: [0, Validators.required],
      presupuestoEjercido: [],
      applicationUserId: [this.authS.applicationUserId],
    });

    this.apiRequestS
      .onGetItem(`CedulaPresupuestalDetalles/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
        this.form.patchValue({
          descripcion: responseData.cuenta.descripcion,
        });
      });
  }
}
