import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
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
  selector: 'app-edit-salidas',
  templateUrl: './edit-salidas.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class EditSalidasComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dateService = inject(DateService);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  form: FormGroup;
  id = 0;
  idProducto = 0;
  nombreProducto: string = '';
  cb_productos: any[] = [];
  cb_measurement_unit: any[] = [];
  dateTodat = new Date();
  cantidadActualUsada: number = 0;
  existenciaAlmacen: number = 0;
  contidadSeleccionada: number = 0;
  cantidadDiferiencia: number = 0;
  cantidadDisponible: number = 0;

  onSelectcantidad() {
    if (this.contidadSeleccionada !== null) {
      this.cantidadDiferiencia =
        this.contidadSeleccionada - this.cantidadActualUsada;
      this.cantidadDisponible =
        this.existenciaAlmacen - this.cantidadDiferiencia;
    }
  }
  get f() {
    return this.form.controls;
  }
  onLoadExistencia() {
    this.subRef$ = this.dataService
      .get(
        `InventarioProducto/GetExistenciaProducto/${this.customerIdService.customerId}/${this.config.data.idProducto}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.existenciaAlmacen = resp.body.existencia;
          }
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnInit(): void {
    flatpickrFactory();
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_measurement_unit = resp;
      });
    this.onLoadExistencia();
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

  onLoadData() {
    this.subRef$ = this.dataService.get(`SalidaProductos/${this.id}`).subscribe(
      (resp: any) => {
        this.nombreProducto = resp.body.producto;
        this.cantidadActualUsada = resp.body.cantidad;
        resp.body.fechaSalida = this.dateService.getDateFormat(
          resp.body.fechaSalida
        );
        this.form.patchValue(resp.body);
      },
      (err) => {
        console.log(err.error);
      }
    );
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
          `SalidaProductos/${this.id}/${this.cantidadActualUsada}`,
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
