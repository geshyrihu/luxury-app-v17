import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-modal-add-proveedor',
  templateUrl: './modal-add-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class ModalAddProveedorComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  form: FormGroup;
  cb_providers: ISelectItemDto[] = [];

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadProviders();
    this.form = this.formBuilder.group({
      solicitudCompraId: [
        this.config.data.solicitudCompraId,
        Validators.required,
      ],
      providerId: ['', { validators: [Validators.required] }],
      providerName: ['', { validators: [Validators.required] }],
      fechaCotizacion: ['', { validators: [Validators.required] }],
      numeroCotizacion: [''],
    });
  }
  public saveProviderId(e): void {
    let find = this.cb_providers.find(
      (x) => x.label.toLowerCase() === e.target.value.toLowerCase()
    );

    this.form.patchValue({
      providerId: find?.value,
    });
  }

  onLoadProviders() {
    this.dataService
      .get(
        `CotizacionProveedor/GetProviders/${this.config.data.solicitudCompraId}`
      )
      .subscribe((resp: any) => {
        this.cb_providers = resp.body;
      });
  }

  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post('CotizacionProveedor', this.form.value)
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
