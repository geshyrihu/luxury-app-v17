import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-create-orden-compra',
  templateUrl: './create-orden-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CreateOrdenCompraComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);

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
    this.proveedorIdRecibido = this.config.data.proveedorId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;
    if (this.posicionCotizacion === undefined) {
      this.posicionCotizacion = 0;
    }
    if (this.proveedorIdRecibido === undefined) {
      this.proveedorIdRecibido = 0;
    }
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
    this.dataService
      .get(`SolicitudCompra/${this.solicitudCompraId}`)
      .subscribe((resp: any) => {
        this.solicitudCompra = resp.body;
        this.form.controls['equipoOInstalacion'].setValue(
          resp.body.equipoOInstalacion
        );
        this.form.controls['justificacionGasto'].setValue(
          resp.body.justificacionGasto
        );
        this.form.controls['folioSolicitudCompra'].setValue(
          this.config.data.folioSolicitudCompra
        );
      });
  }
  onSubmit() {
    this.ref.close();
    if (!this.apiRequestService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.ordenCompraId === 0) {
      this.dataService
        .post(
          `OrdenCompra/${this.proveedorIdRecibido}/${this.posicionCotizacion}`,
          this.form.value
        )
        .subscribe({
          next: (resp: any) => {
            this.ref.close(resp.body.id);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
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
