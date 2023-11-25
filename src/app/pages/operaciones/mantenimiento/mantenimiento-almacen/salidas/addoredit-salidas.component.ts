import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  selector: 'app-addoredit-salidas',
  templateUrl: './addoredit-salidas.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class CrudSalidasComponent implements OnInit, OnDestroy {
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  private dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);

  private customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  subRef$: Subscription;

  form: FormGroup;
  id = 0;
  idProducto = 0;
  nombreProducto = '';
  cantidadActual = 0;
  contidadSeleccionada: number = 0;
  cb_productos: any[] = [];
  cb_measurement_unit: any[] = [];
  existenciaActual: 0;
  dateTodat = new Date();
  noHaystock = '';

  ngOnInit(): void {
    flatpickrFactory();
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_measurement_unit = resp;
      });

    this.subRef$ = this.dataService
      .get(
        `InventarioProducto/GetExistenciaProducto/${this.customerIdService.customerId}/${this.config.data.idProducto}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.existenciaActual = resp.body.existencia;
          }
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
    // ...para obtener la cantidad actual de producto existentes
    this.id = this.config.data.id;

    this.nombreProducto = this.config.data.nombreProducto;
    this.idProducto = this.config.data.idProducto;

    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: 0, disabled: true },
      customerId: [this.customerIdService.customerId, Validators.required],
      fechaSalida: [this.dateService.getDateNow(), Validators.required],
      productoId: [this.idProducto, Validators.required],
      cantidad: [0, Validators.required],
      unidadMedidaId: ['', Validators.required],
      usoPrducto: ['', Validators.required],
      quienUso: ['', Validators.required],
      horaSalida: [
        `${this.dateTodat.getHours()}:${this.dateTodat.getMinutes()}`,
        Validators.required,
      ],
      employeeId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        Validators.required,
      ],
    });
  }
  // convenience getter for easy access to form fields

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`SalidaProductos/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.nombreProducto = resp.body.producto;
          this.cantidadActual = resp.body.cantidad;
          resp.body.fechaSalida = this.dateService.getDateFormat(
            resp.body.fechaSalida
          );
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post('SalidaProductos', this.form.value)
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
          `SalidaProductos/${this.id}/${this.cantidadActual}`,
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
