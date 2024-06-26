import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { ETurnoTrabajo } from 'src/app/core/enums/turno-trabajo.enum';
import { ETypeOfDeparture } from 'src/app/core/enums/type-of-departure.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-status-request-salary-modification',
  templateUrl: './addoredit-status-request-salary-modification.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditStatusRequestSalaryModificationComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: number = 0;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_profession: ISelectItem[] = [];
  cb_status: ISelectItem[] = onGetSelectItemFromEnum(ETurnoTrabajo);
  cb_type_departure: ISelectItem[] = onGetSelectItemFromEnum(ETypeOfDeparture);
  cb_si_no: ISelectItem[] = cb_ESiNo;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.config.data.id, disabled: true },
    employeeId: ['', Validators.required],
    workPositionId: ['', Validators.required],
    requestDate: ['', Validators.required],
    soport: [''],
    professionCurrentId: ['', Validators.required],
    professionNewId: ['', Validators.required],
    currentSalary: ['', Validators.required],
    finalSalary: ['', Validators.required],
    executionDate: ['', Validators.required],
    folio: ['', Validators.required],
    retroactive: ['', Validators.required],
    status: ['', Validators.required],
    applicationUserId: ['', Validators.required],
    confirmationFinish: ['', Validators.required],
  });

  ngOnInit(): void {
    this.onProfessionSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`RequestSalaryModification/GetById/${this.id}`)
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

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`RequestSalaryModification`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
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
        .put(`RequestSalaryModification/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  onProfessionSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
