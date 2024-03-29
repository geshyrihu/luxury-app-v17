import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ETipoGasto } from 'src/app/core/enums/tipo-gasto.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-datos-pago',
  templateUrl: './orden-compra-datos-pago.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraDatosPagoComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ordenCompraDatosPagoId = 0;
  cb_providers: ISelectItemDto[] = [];
  cb_formaPago: ISelectItemDto[] = [];
  cb_payment_method: ISelectItemDto[] = [];
  cb_usoCfdi: ISelectItemDto[] = [];
  cb_tipoGasto: ISelectItemDto[] = onGetSelectItemFromEnum(ETipoGasto);
  form: FormGroup = this.formBuilder.group({
    id: [0],
    ordenCompraId: [0],
    formaDePagoId: [0],
    metodoDePagoId: [0],
    providerId: [0, Validators.required],
    usoCFDIId: [0],
    tipoGasto: [0],
    provider: ['', Validators.required],
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

    this.dataService
      .get(`OrdenCompraDatosPago/${this.ordenCompraDatosPagoId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.dataService
      .put(
        `OrdenCompraDatosPago/${this.ordenCompraDatosPagoId}`,
        this.form.value
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
