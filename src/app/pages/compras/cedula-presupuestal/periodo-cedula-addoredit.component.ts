import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-periodo-cedula-addoredit',
  templateUrl: './periodo-cedula-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class PeriodoCedulaPresupuestalAddoreditComponent
  implements OnInit
{
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    desde: ['', Validators.required],
    hasta: ['', Validators.required],
    customerId: [],
  });

  ngOnInit() {
    this.id = this.config.data.cedulaId;
    this.onLoadItem();
  }
  onLoadItem() {
    const url = `CedulaPresupuestal/GetCedulaPresuppuestal/${this.id}`;
    this.apiRequestS.onGetItem(url).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`CedulaPresupuestal`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`CedulaPresupuestal/Actualizar/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
