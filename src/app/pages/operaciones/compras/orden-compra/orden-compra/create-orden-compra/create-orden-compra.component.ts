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
  selector: 'app-create-orden-compra',
  templateUrl: './create-orden-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CreateOrdenCompraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);

  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  solicitudCompraId: number = 0;
  solicitudCompra: any;
  ordenCompraId = 0;
  form: FormGroup;
  date: string = '';
  proveedorIdRecibido: number = 0;
  posicionCotizacion: number = 0;

  ngOnInit(): void {
    flatpickrFactory();
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    // this.proveedorIdRecibido = this.config.data.proveedorId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;
    if (this.posicionCotizacion === undefined) {
      this.posicionCotizacion = 0;
    }
    this.proveedorIdRecibido = 0;
    // if (this.proveedorIdRecibido === undefined) {
    // }
    this.date = this.dateService.getDateFormat(new Date());
    if (this.solicitudCompraId !== undefined) {
      this.onLoadSolicitudCompra();
    }
    this.form = this.formBuilder.group({
      id: [0, Validators.required],
      customerId: [this.customerIdService.getcustomerId(), Validators.required],
      folio: [''],
      fechaSolicitud: [this.date, Validators.required],
      folioSolicitudCompra: [''],
      urlFile: [''],
      equipoOInstalacion: ['', Validators.required],
      justificacionGasto: ['', Validators.required],
      revisadoPorResidente: [''],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    });
  }

  onLoadSolicitudCompra() {
    const urlApi = `SolicitudCompra/${this.solicitudCompraId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.solicitudCompra = result;
      this.form.controls['equipoOInstalacion'].setValue(
        result.equipoOInstalacion
      );
      this.form.controls['justificacionGasto'].setValue(
        result.justificacionGasto
      );
      this.form.controls['folioSolicitudCompra'].setValue(
        this.config.data.folioSolicitudCompra
      );
    });
  }
  onSubmit() {
    this.ref.close();
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.ordenCompraId === 0) {
      this.apiRequestService
        .onPost(
          `OrdenCompra/${this.proveedorIdRecibido}/${this.posicionCotizacion}`,
          this.form.value
        )
        .then((result: any) => {
          this.ref.close(result.id);
        });
    } else {
      this.apiRequestService
        .onPut(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
