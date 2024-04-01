import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { EStatus } from 'src/app/core/enums/status.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-modificacion-salario',
  templateUrl: './addoredit-modificacion-salario.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
})
export default class AddoreditModificacionSalarioComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  private customToastService = inject(CustomToastService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  cb_status: ISelectItem[] = onGetSelectItemFromEnum(EStatus);
  cb_si_no: ISelectItem[] = cb_ESiNo;
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    applicationUserId: [, Validators.required],
    confirmationFinish: [, Validators.required],
    currentSalary: [, Validators.required],
    employeeId: [, Validators.required],
    executionDate: [, Validators.required],
    finalSalary: [, Validators.required],
    folio: [, Validators.required],
    professionCurrentId: [, Validators.required],
    professionNewId: [, Validators.required],
    requestDate: [, Validators.required],
    retroactive: [, Validators.required],
    soport: [],
    status: [, Validators.required],
    workPositionId: [, Validators.required],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`requestsalarymodification/getbyid/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.dataService
      .put(`requestsalarymodification/${this.id}`, this.form.value)
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
