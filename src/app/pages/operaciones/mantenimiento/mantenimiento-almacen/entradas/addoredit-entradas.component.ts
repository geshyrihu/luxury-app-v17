import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-entradas',
  templateUrl: './addoredit-entradas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditEntradasComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public customToastService = inject(CustomToastService);
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private dateService = inject(DateService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);

  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup = this.formBuilder.group({
    id: { value: 0, disabled: true },
    providerId: ['', Validators.required],
    customerId: [this.customerIdService.customerId, Validators.required],
    fechaEntrada: [this.dateService.getDateNow(), Validators.required],
    productoId: [0, Validators.required],
    cantidad: ['', Validators.required],
    unidadMedidaId: ['', Validators.required],
    numeroFactura: ['', Validators.required],
    providerName: ['', Validators.required],
    employeeId: [
      this.authService.userTokenDto.infoEmployeeDto.employeeId,
      Validators.required,
    ],
  });
  id = 0;
  idProducto = 0;
  nombreProducto = '';
  cantidadActual = 0;
  cb_productos: any[] = [];

  cb_measurement_unit: any[] = [];
  cb_providers: any[] = [];
  mostrarProductos = false;

  public saveProviderId(e): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }

  ngOnInit(): void {
    flatpickrFactory();

    this.apiRequestService
      .onGetSelectItem(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_measurement_unit = response;
      });

    this.apiRequestService
      .onGetSelectItem(`Providers`)
      .then((response: any) => {
        this.cb_providers = response;
      });

    this.form.patchValue({ productoId: this.config.data.idProducto });
    this.id = this.config.data.id;
    if (this.config.data.idProducto == 0) {
      this.mostrarProductos = true;
    } else {
      this.mostrarProductos = false;
    }
    this.nombreProducto = this.config.data.nombreProducto;
    this.idProducto = this.config.data.idProducto;

    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`EntradaProducto/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.nombreProducto = resp.body.nombreProducto;
          this.cantidadActual = resp.body.cantidad;
          this.form.patchValue(resp.body);
          this.form.patchValue({
            fechaEntrada: this.dateService.getDateFormat(
              resp.body.fechaEntrada
            ),
          });
          this.form.patchValue({
            providerId: resp.body.providerId,
          });
          this.form.patchValue({
            providerName: resp.body.provider,
          });
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // convenience getter for easy access to form fields

  onSubmit() {
    this.id = this.config.data.id;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post('EntradaProducto', this.form.value)
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
    } else {
      this.dataService
        .put(
          `EntradaProducto/${this.id}/${this.cantidadActual}`,
          this.form.value
        )
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
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
