import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  router = inject(Router);

  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
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

    this.date = this.dateService.getDateFormat(new Date());
    if (this.solicitudCompraId !== undefined) {
      this.onLoadSolicitudCompra();
    }
    this.form = this.formBuilder.group({
      id: [0, Validators.required],
      customerId: [this.custIdService.getCustomerId(), Validators.required],
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
    this.apiRequestService.onGetSelectItem(url).then((result: any) => {
      this.cb_providers = result;
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
          `ordencompra/${this.providerId}/${this.posicionCotizacion}`,
          this.form.value
        )
        .then((result: any) => {
          if (result) {
            this.router.navigateByUrl(`/compras/orden-compra/${result.id}`);
            this.submitting = false;
          }
        });
    } else {
      this.apiRequestService
        .onPut(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
        .then((result: any) => {
          result ? this.ref.close(result.id) : (this.submitting = false);
        });
    }
  }
  public saveProviderId(e): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.providerId = find?.value;
  }
}
