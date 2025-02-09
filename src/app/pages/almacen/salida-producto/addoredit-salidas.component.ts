import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-salidas',
  templateUrl: './addoredit-salidas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CrudSalidasComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);

  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

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

    this.apiRequestService
      .onGetSelectItem(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_measurement_unit = response;
      });

    const urlApi = `InventarioProducto/GetExistenciaProducto/${this.custIdService.customerId}/${this.config.data.idProducto}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      if (result) this.existenciaActual = result.existencia;
    });

    // ...para obtener la cantidad actual de producto existentes
    this.id = this.config.data.id;

    this.nombreProducto = this.config.data.nombreProducto;
    this.idProducto = this.config.data.idProducto;

    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: 0, disabled: true },
      customerId: [this.custIdService.customerId, Validators.required],
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
  // convenience getter for easy access to form fields

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    const urlApi = `salidaproductos/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.nombreProducto = result.producto;
      this.cantidadActual = result.cantidad;
      result.fechaSalida = this.dateService.getDateFormat(result.fechaSalida);
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost('SalidaProductos', this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(
          `SalidaProductos/${this.id}/${this.cantidadActual}`,
          this.form.value
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
