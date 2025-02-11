import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
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
  apiRequestS = inject(ApiRequestService);
  router = inject(Router);

  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  solicitudCompraId: number = 0;
  solicitudCompra: any;
  ordenCompraId = 0;
  form: FormGroup;
  date: string = '';
  posicionCotizacion: number = 0;

  providerId = 0;
  providerName: string = '';
  cb_providers: any[] = [];

  ngOnInit(): void {
    this.onLoadSelectItemProvider();
    flatpickrFactory();
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;

    if (this.posicionCotizacion === undefined) {
      this.posicionCotizacion = 0;
    }

    this.date = this.dateS.getDateFormat(new Date());
    if (this.solicitudCompraId !== undefined) {
      this.onLoadSolicitudCompra();
    }
    this.form = this.formB.group({
      id: [0, Validators.required],
      customerId: [this.customerIdS.getCustomerId(), Validators.required],
      folio: [''],
      fechaSolicitud: [this.date, Validators.required],
      folioSolicitudCompra: [''],
      urlFile: [''],
      equipoOInstalacion: ['', Validators.required],
      justificacionGasto: ['', Validators.required],
      revisadoPorResidente: [''],

      applicationUserId: [this.authS.applicationUserId],
    });
  }

  onLoadSelectItemProvider() {
    const url = 'providers';
    this.apiRequestS.onGetSelectItem(url).then((responseData: any) => {
      this.cb_providers = responseData;
    });
  }

  onLoadSolicitudCompra() {
    const urlApi = `SolicitudCompra/${this.solicitudCompraId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.solicitudCompra = responseData;
      this.form.controls['equipoOInstalacion'].setValue(
        responseData.equipoOInstalacion
      );
      this.form.controls['justificacionGasto'].setValue(
        responseData.justificacionGasto
      );
      this.form.controls['folioSolicitudCompra'].setValue(
        this.config.data.folioSolicitudCompra
      );
    });
  }
  onSubmit() {
    this.ref.close();
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.ordenCompraId === 0) {
      this.apiRequestS
        .onPost(
          `ordencompra/${this.providerId}/${this.posicionCotizacion}`,
          this.form.value
        )
        .then((responseData: any) => {
          if (responseData) {
            this.router.navigateByUrl(
              `/compras/orden-compra/${responseData.id}`
            );
            this.submitting = false;
          }
        });
    } else {
      this.apiRequestS
        .onPut(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
        .then((responseData: any) => {
          responseData
            ? this.ref.close(responseData.id)
            : (this.submitting = false);
        });
    }
  }
  public saveProviderId(e): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.providerId = find?.value;
  }
}
