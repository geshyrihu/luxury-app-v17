import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-edit-presupusto-utilizado',
  templateUrl: './orden-compra-edit-presupusto-utilizado.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraEditPresupustoUtilizadoComponent
  implements OnInit
{
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;

  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    dineroUsado: ['', Validators.required],
    ordenCompraId: ['', Validators.required],
    cedulaPresupuestalDetalleId: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`OrdenCompraPresupuesto/GetId/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    this.apiRequestS
      .onPut(`OrdenCompraPresupuesto/${this.id}`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
