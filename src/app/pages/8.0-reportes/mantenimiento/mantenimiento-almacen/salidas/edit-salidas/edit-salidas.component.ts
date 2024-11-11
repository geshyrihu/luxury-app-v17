import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-edit-salidas',
  templateUrl: './edit-salidas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EditSalidasComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  dateService = inject(DateService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

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
    const urlApi = `InventarioProducto/GetExistenciaProducto/${this.customerIdService.customerId}/${this.config.data.idProducto}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      if (result !== null) {
        this.existenciaAlmacen = result.existencia;
      }
    });
  }
  ngOnInit(): void {
    flatpickrFactory();

    this.apiRequestService
      .onGetSelectItem(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_measurement_unit = response;
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
      applicationUserId: [this.authS.applicationUserId, Validators.required],
    });
  }

  onLoadData() {
    const urlApi = `SalidaProductos/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.nombreProducto = result.producto;
      this.cantidadActualUsada = result.cantidad;
      result.fechaSalida = this.dateService.getDateFormat(result.fechaSalida);
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    this.id = this.config.data.id;

    this.submitting = true;
    if (this.id === 0) {
      this.apiRequestService
        .onPost(`SalidaProductos`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(
          `SalidaProductos/${this.id}/${this.cantidadActualUsada}`,
          this.form.value
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
