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
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
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
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.customerId],
    equipoOInstalacion: ['', Validators.required],
    justificacionGasto: ['', Validators.required],
    providerName: ['', Validators.required],
    providerId: ['', Validators.required],
    usoCFDIId: ['', Validators.required],
    metodoDePagoId: ['', Validators.required],
    formaDePagoId: ['', Validators.required],
    catalogoGastosFijosPresupuesto: this.formBuilder.array([]),
    catalogoGastosFijosDetalles: this.formBuilder.array([]),
    personId: [this.authService.personId],
    applicationUserId: [this.authService.applicationUserId],
  });

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem('Providers')
      .then((response: any) => {
        this.cb_providers = response;
      });

    this.apiRequestService.onGetSelectItem('UseCFDI').then((response: any) => {
      this.cb_use_cfdi = response;
    });

    this.apiRequestService
      .onGetSelectItem('PaymentMethod')
      .then((response: any) => {
        this.cb_metodoDePago = response;
      });

    this.apiRequestService.onGetSelectItem('WayToPay').then((response: any) => {
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
    this.apiRequestService
      .onGetItem(`CatalogoGastosFijos/${this.id}`)
      .then((result: any) => {
        this.catalogoGastosFijosService.setCatalogoGastosFijosId(result.id);

        this.form.patchValue(result);
        this.form.patchValue({
          providerName: result.provider,
        });
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`CatalogoGastosFijos`, this.form.value)
        .then((result: any) => {
          this.id = result.id;
          this.onLoadData();
        });
    } else {
      this.apiRequestService
        .onPut(`CatalogoGastosFijos/${this.id}`, this.form.value)
        .then((result: boolean) => {
          this.onLoadData();
        });
    }
  }
}
