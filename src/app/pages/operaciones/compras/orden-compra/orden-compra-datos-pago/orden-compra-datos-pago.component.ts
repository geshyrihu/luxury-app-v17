import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETipoGasto } from 'src/app/core/enums/tipo-gasto.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-datos-pago',
  templateUrl: './orden-compra-datos-pago.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraDatosPagoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;

  ordenCompraDatosPagoId = 0;
  cb_providers: ISelectItem[] = [];
  cb_formaPago: ISelectItem[] = [];
  cb_payment_method: ISelectItem[] = [];
  cb_usoCfdi: ISelectItem[] = [];
  cb_tipoGasto: ISelectItem[] = onGetSelectItemFromEnum(ETipoGasto);
  form: FormGroup = this.formBuilder.group({
    id: [0],
    ordenCompraId: [0],
    formaDePagoId: [0],
    metodoDePagoId: [0],
    providerId: [0, Validators.required],
    usoCFDIId: [0],
    tipoGasto: [0],
    provider: ['', Validators.required],
    personId: [this.authService.personId],
  });

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);

    this.form.patchValue({
      providerId: find?.value,
    });
  }

  ngOnInit(): void {
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
