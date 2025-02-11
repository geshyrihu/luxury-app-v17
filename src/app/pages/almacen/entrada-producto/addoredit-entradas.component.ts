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
  selector: 'app-addoredit-entradas',
  templateUrl: './addoredit-entradas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditEntradasComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);

  ref = inject(DynamicDialogRef);
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: 0, disabled: true },
    providerId: ['', Validators.required],
    customerId: [this.customerIdS.customerId, Validators.required],
    fechaEntrada: [this.dateS.getDateNow(), Validators.required],
    productoId: [0, Validators.required],
    cantidad: ['', Validators.required],
    unidadMedidaId: ['', Validators.required],
    numeroFactura: ['', Validators.required],
    providerName: ['', Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
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

    this.apiRequestS
      .onGetSelectItem(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_measurement_unit = response;
      });

    this.apiRequestS.onGetSelectItem(`Providers`).then((response: any) => {
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
    const urlApi = `EntradaProducto/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.nombreProducto = responseData.nombreProducto;
      this.cantidadActual = responseData.cantidad;
      this.form.patchValue(responseData);
      this.form.patchValue({
        fechaEntrada: this.dateS.getDateFormat(responseData.fechaEntrada),
      });
      this.form.patchValue({
        providerId: responseData.providerId,
      });
      this.form.patchValue({
        providerName: responseData.provider,
      });
    });
  }

  // convenience getter for easy access to form fields

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`EntradaProducto`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(
          `EntradaProducto/${this.id}/${this.cantidadActual}`,
          this.form.value
        )
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
