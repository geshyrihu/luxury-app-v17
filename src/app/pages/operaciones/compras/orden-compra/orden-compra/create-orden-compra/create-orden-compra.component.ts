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
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-create-orden-compra',
  templateUrl: './create-orden-compra.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class CreateOrdenCompraComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  solicitudCompraId: number = 0;
  solicitudCompra: any;
  ordenCompraId = 0;
  form: FormGroup;
  date: string = '';
  proveedorIdRecibido: number = 0;
  posicionCotizacion: number = 0;
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

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
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
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
