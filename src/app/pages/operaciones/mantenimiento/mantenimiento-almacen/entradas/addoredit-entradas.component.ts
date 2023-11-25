import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-entradas',
  templateUrl: './addoredit-entradas.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AddOrEditEntradasComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public customToastService = inject(CustomToastService);
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  private dateService = inject(DateService);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);

  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  subRef$: Subscription;

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
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_measurement_unit = resp;
      });
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
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
    this.subRef$ = this.dataService.get(`EntradaProducto/${this.id}`).subscribe(
      (resp: any) => {
        this.nombreProducto = resp.body.nombreProducto;
        this.cantidadActual = resp.body.cantidad;
        this.form.patchValue(resp.body);
        this.form.patchValue({
          fechaEntrada: this.dateService.getDateFormat(resp.body.fechaEntrada),
        });
        this.form.patchValue({
          providerId: resp.body.providerId,
        });
        this.form.patchValue({
          providerName: resp.body.provider,
        });
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  // convenience getter for easy access to form fields

  onSubmit() {
    this.id = this.config.data.id;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post('EntradaProducto', this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(
          `EntradaProducto/${this.id}/${this.cantidadActual}`,
          this.form.value
        )
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
