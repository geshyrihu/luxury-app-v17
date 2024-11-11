import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-denegada',
  templateUrl: './orden-compra-denegada.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraDenegadaComponent implements OnInit {
  apiRequestService= inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  ordenCompraId: number = 0;
  ordenCompraAuthId: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: [],
    ordenCompraId: [],
    fechaAutorizacion: [],
    statusOrdenCompra: [],
    observaciones: [''],
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.ordenCompraAuthId = this.config.data.ordenCompraAuthId;
    this.form = this.formBuilder.group({
      id: [this.ordenCompraAuthId],
      ordenCompraId: [this.ordenCompraId],
      fechaAutorizacion: [''],
      statusOrdenCompra: [1],
      observaciones: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitting = true;
    this.apiRequestService
      .onPut(
        `OrdenCompraAuth/NoAutorizada/${this.ordenCompraAuthId}/${this.authS.applicationUserId}`,
        this.form.value
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
