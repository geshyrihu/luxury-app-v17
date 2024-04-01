import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AutosizeDirective } from 'src/app/core/directives/autosize-text-area.diective';
import { ETurnoTrabajo } from 'src/app/core/enums/turno-trabajo.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-vacante',
  templateUrl: './solicitud-vacante.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, AutosizeDirective, CustomInputModule],
})
export default class SolicitudVacanteComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  private customToastService = inject(CustomToastService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authService = inject(AuthService);

  workPositionId: number = this.config.data.workPositionId;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any;
  submitting: boolean = false;

  id: number = 0;

  cb_turnoTrabajo: ISelectItem[] = onGetSelectItemFromEnum(ETurnoTrabajo);
  form: FormGroup = this.formBuilder.group({
    id: [this.config.data.workPositionId],
    professionName: [, Validators.required],
    sueldo: ['', [Validators.required, Validators.minLength(4)]],
    sueldoBase: ['', [Validators.required, Validators.minLength(4)]],
    turnoTrabajo: [0],
    lunesEntrada: [''],
    lunesSalida: [''],
    martesEntrada: [''],
    martesSalida: [''],
    miercolesEntrada: [''],
    miercolesSalida: [''],
    juevesEntrada: [''],
    juevesSalida: [''],
    viernesEntrada: [''],
    viernesSalida: [''],
    sabadoEntrada: [''],
    sabadoSalida: [''],
    domingoEntrada: [''],
    domingoSalida: [''],
    additionalInformation: [''],
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`WorkPosition/${this.workPositionId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(
        `SolicitudesReclutamiento/SolicitudVacante/${this.authService.infoUserAuthDto.applicationUserId}`,
        this.form.value
      )
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
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
