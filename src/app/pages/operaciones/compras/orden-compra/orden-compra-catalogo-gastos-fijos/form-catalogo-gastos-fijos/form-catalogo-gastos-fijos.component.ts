import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CatalogoGastosFijosService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-catalogo-gastos-fijos',
  templateUrl: './form-catalogo-gastos-fijos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormCatalogoGastosFijosComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  public customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // metodoDePagoId: [19, Validators.required],
    // formaDePagoId: [1, Validators.required],
    catalogoGastosFijosPresupuesto: this.formBuilder.array([]),
    catalogoGastosFijosDetalles: this.formBuilder.array([]),
    applicationUserId: [
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
    ],
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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get<any>(`CatalogoGastosFijos/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.catalogoGastosFijosService.setCatalogoGastosFijosId(
            resp.body.id
          );

          this.form.patchValue(resp.body);
          this.form.patchValue({
            providerName: resp.body.provider,
          });
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`CatalogoGastosFijos`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: (resp: any) => {
            this.id = resp.body.id;
            this.onLoadData();
            this.customToastService.onCloseToSuccess();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`CatalogoGastosFijos/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.onLoadData();
            this.customToastService.onCloseToSuccess();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
