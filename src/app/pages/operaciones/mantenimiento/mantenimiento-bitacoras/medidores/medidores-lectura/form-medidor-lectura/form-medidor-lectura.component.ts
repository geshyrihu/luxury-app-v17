import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IMedidorLectura } from 'src/app/core/interfaces/medidor-lectura.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
const date = new Date();
@Component({
  selector: 'app-form-medidor-lectura',
  templateUrl: './form-medidor-lectura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormMedidorLecturaComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  public dateService = inject(DateService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

  dateString: string = this.dateService.getDateFormat(date);
  dateStringUltimoRegistro: string = '';
  seRegistroEsteDia: boolean = false;
  seRegistroEsteDiaMensaje: string = 'Ya se cargo el registro de este día';
  id: number = 0;
  ultimaLectura: number = 0;
  medidorId: number = 0;
  cb_nombreMedidorCategoria: any[] = [];
  form: FormGroup;

  validarUltimaLectura() {
    if (this.dateString === this.dateStringUltimoRegistro) {
      this.seRegistroEsteDia = true;
    } else {
      this.seRegistroEsteDia = false;
    }
  }
  ngOnInit(): void {
    this.id = this.config.data.id;
    this.medidorId = this.config.data.medidorId;
    this.dataService
      .get(`MedidorLectura/UltimaLectura/${this.medidorId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.dateStringUltimoRegistro = this.dateService.getDateFormat(
              resp.body.fechaRegistro
            );
            this.validarUltimaLectura();
            this.ultimaLectura = resp.body.lectura;
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      medidorId: [this.medidorId],
      fechaRegistro: [''],
      lectura: ['', Validators.required],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    });
  }
  onLoadData() {
    this.dataService
      .get<IMedidorLectura>(`MedidorLectura/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (this.form.value.lectura == 0) {
      return;
    }
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`MedidorLectura`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
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
    } else {
      this.dataService
        .put(`MedidorLectura/${this.id}`, this.form.value)
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
  laLecturaEsMenor = false;
  evaluarLectura(event: any) {
    if (
      event.target.value < Number(this.ultimaLectura) &&
      this.ultimaLectura !== 0
    ) {
      this.laLecturaEsMenor = true;
    } else {
      this.laLecturaEsMenor = false;
    }
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
  get f() {
    return this.form.controls;
  }
}
