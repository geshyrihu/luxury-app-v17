import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-bitacora-diaria',
  templateUrl: './addoredit-bitacora-diaria.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditBitacoraDiariaComponent
  implements OnInit, OnDestroy
{
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);

  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dateService = inject(DateService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

  id: number = 0;

  cb_customer: any[] = [];
  rangeDates: Date[];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    fechaSolicitud: [this.dateService.getDateNow(), Validators.required],
    customerId: [
      this.authService.userTokenDto.infoUserAuthDto.customerId,
      Validators.required,
    ],
    problema: ['', Validators.required],
    solucion: [''],
    fechaConclusion: [],
    personId: [this.authService.personId, Validators.required],
  });

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`customers`)
      .then((response: any) => {
        this.cb_customer = response;
      });
  }

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.id;
    this.onLoadSelectItem();
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`AgendaSupervision/${this.id}`)
      .subscribe((resp: any) => {
        resp.body.fechaConclusion = this.dateService.getDateFormat(
          resp.body.fechaConclusion
        );
        resp.body.fechaSolicitud = this.dateService.getDateFormat(
          resp.body.fechaSolicitud
        );
        this.form.patchValue(resp.body);
      });
  }

  submit() {
    this.form.patchValue({
      employeeId: this.authService.userTokenDto.infoEmployeeDto.employeeId,
    });

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`AgendaSupervision/`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`AgendaSupervision/${this.id}`, this.form.value)
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
