import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-status',
  templateUrl: './orden-compra-status.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraStatusComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;

  ordenCompraId: number = 0;
  ordenCompraStatus: any;
  form: FormGroup = this.formB.group({
    id: [0],
    ordenCompraId: [0],
    sePago: [false],
    seRecibio: [false],
    recibidoPor: [''],
    factura: [''],
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`OrdenCompraStatus/${this.ordenCompraId}`)
      .then((result: any) => {
        this.ordenCompraStatus = result;
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    this.submitting = true;

    this.apiRequestS
      .onPut(`OrdenCompraStatus/${this.ordenCompraStatus.id}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
