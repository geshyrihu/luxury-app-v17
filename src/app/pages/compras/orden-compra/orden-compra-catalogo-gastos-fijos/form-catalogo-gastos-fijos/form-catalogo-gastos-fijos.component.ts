import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-catalogo-gastos-fijos',
  templateUrl: './form-catalogo-gastos-fijos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormCatalogoGastosFijosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  submitting: boolean = false;

  @Input()
  id: number = 0;
  anio = 2021;
  cb_use_cfdi: any[] = [];
  cb_metodoDePago: any[] = [];
  cb_formaDePago: any[] = [];

  cb_providers: any[] = [];
  proveedor: SelectItem;
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdS.customerId],
    equipoOInstalacion: ['', Validators.required],
    justificacionGasto: ['', Validators.required],
    providerName: ['', Validators.required],
    providerId: ['', Validators.required],
    usoCFDIId: ['', Validators.required],
    metodoDePagoId: ['', Validators.required],
    formaDePagoId: ['', Validators.required],
    catalogoGastosFijosPresupuesto: this.formB.array([]),
    catalogoGastosFijosDetalles: this.formB.array([]),
    applicationUserId: [this.authS.applicationUserId],
  });

  ngOnInit(): void {
    this.apiRequestS.onGetSelectItem('Providers').then((response: any) => {
      this.cb_providers = response;
    });

    this.apiRequestS.onGetSelectItem('UseCFDI').then((response: any) => {
      this.cb_use_cfdi = response;
    });

    this.apiRequestS.onGetSelectItem('PaymentMethod').then((response: any) => {
      this.cb_metodoDePago = response;
    });

    this.apiRequestS.onGetSelectItem('WayToPay').then((response: any) => {
      this.cb_formaDePago = response;
    });

    this.id = this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    if (this.id !== 0) this.onLoadData();
  }

  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`CatalogoGastosFijos/${this.id}`)
      .then((responseData: any) => {
        this.catalogoGastosFijosService.setCatalogoGastosFijosId(
          responseData.id
        );

        this.form.patchValue(responseData);
        this.form.patchValue({
          providerName: responseData.provider,
        });
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`CatalogoGastosFijos`, this.form.value)
        .then((responseData: any) => {
          this.id = responseData.id;
          this.onLoadData();
        });
    } else {
      this.apiRequestS
        .onPut(`CatalogoGastosFijos/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          this.onLoadData();
        });
    }
  }
}
