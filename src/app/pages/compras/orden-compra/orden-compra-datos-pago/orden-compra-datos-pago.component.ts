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
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class OrdenCompraDatosPagoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  enumSelectS = inject(EnumSelectService);

  submitting: boolean = false;

  ordenCompraDatosPagoId = 0;
  cb_providers: ISelectItem[] = [];
  cb_formaPago: ISelectItem[] = [];
  cb_payment_method: ISelectItem[] = [];
  cb_usoCfdi: ISelectItem[] = [];
  cb_tipoGasto: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
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

    this.apiRequestS.onGetSelectItem('Providers').then((response: any) => {
      this.cb_providers = response;
    });

    this.apiRequestS.onGetSelectItem('PaymentMethod').then((response: any) => {
      this.cb_payment_method = response;
    });

    this.apiRequestS.onGetSelectItem('UseCFDI').then((response: any) => {
      this.cb_usoCfdi = response;
    });

    this.apiRequestS.onGetSelectItem('WayToPay').then((response: any) => {
      this.cb_formaPago = response;
    });

    this.apiRequestS
      .onGetItem(`OrdenCompraDatosPago/${this.ordenCompraDatosPagoId}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
    this.cb_tipoGasto = await this.enumSelectS.tipoGasto();
  }
  onSubmit() {
    this.submitting = true;

    this.apiRequestS
      .onPut(
        `OrdenCompraDatosPago/${this.ordenCompraDatosPagoId}`,
        this.form.value
      )
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
