import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-datos-pago',
  templateUrl: './orden-compra-datos-pago.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class OrdenCompraDatosPagoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  ordenCompraDatosPagoId = 0;
  cb_providers: ISelectItem[] = [];
  cb_formaPago: ISelectItem[] = [];
  cb_payment_method: ISelectItem[] = [];
  cb_usoCfdi: ISelectItem[] = [];
  cb_tipoGasto: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: [0],
    ordenCompraId: [0],
    formaDePagoId: [0],
    metodoDePagoId: [0],
    providerId: [0, Validators.required],
    usoCFDIId: [0],
    tipoGasto: [null],
    provider: ['', Validators.required],
  });

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);

    this.form.patchValue({
      providerId: find?.value,
    });
  }

  async ngOnInit() {
    this.ordenCompraDatosPagoId =
      this.config.data.ordenCompra.ordenCompraDatosPago.id;

    this.apiRequestService
      .onGetSelectItem('Providers')
      .then((response: any) => {
        this.cb_providers = response;
      });

    this.apiRequestService
      .onGetSelectItem('PaymentMethod')
      .then((response: any) => {
        this.cb_payment_method = response;
      });

    this.apiRequestService.onGetSelectItem('UseCFDI').then((response: any) => {
      this.cb_usoCfdi = response;
    });

    this.apiRequestService.onGetSelectItem('WayToPay').then((response: any) => {
      this.cb_formaPago = response;
    });

    this.apiRequestService
      .onGetItem(`OrdenCompraDatosPago/${this.ordenCompraDatosPagoId}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
    this.cb_tipoGasto = await this.enumSelectService.tipoGasto();
  }
  onSubmit() {
    this.submitting = true;

    this.apiRequestService
      .onPut(
        `OrdenCompraDatosPago/${this.ordenCompraDatosPagoId}`,
        this.form.value
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
