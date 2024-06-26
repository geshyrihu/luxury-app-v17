import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EStatus } from 'src/app/core/enums/status.enum';
import { ETypeContractRegister } from 'src/app/core/enums/type-contract-register.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-solicitud-alta',
  templateUrl: './addoredit-solicitud-alta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
})
export default class AddOrEditSolicitudAltaComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;
  empleados: ISelectItem[] = [];
  cb_status = onGetSelectItemFromEnum(EStatus);
  cb_typeContractRegister = onGetSelectItemFromEnum(ETypeContractRegister);
  id: number = 0;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    requestPositionCandidateId: [null],
    requestDate: ['', Validators.required],
    folio: [],
    executionDate: ['', Validators.required],
    typeContractRegister: [1, Validators.required],
    status: ['', Validators.required],
    applicationUserId: [],
    confirmationFinish: [],
    positionRequestId: [],
    employeeId: [],
    employee: [],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.onLoadEmpleados();

    this.dataService
      .get(`RequestEmployeeRegister/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          if (resp.body.employeeId !== null) {
            let find = this.empleados.find(
              (x) => x?.value === resp.body.employeeId
            );

            this.form.patchValue({
              employee: find?.label,
            });
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadEmpleados() {
    this.dataService
      .get(`Employees/EmployeeTemp`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.empleados = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;

    this.form.patchValue({
      requestPositionCandidateId: null,
    });
    this.submitting = true;
    if (this.id === 0) {
      this.dataService
        .post(`RequestEmployeeRegister`, this.form.value)
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
        .put(`RequestEmployeeRegister/${this.id}`, this.form.value)
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

  //  Temporal....
  public saveProviderId(e: any): void {
    let find = this.empleados.find((x) => x?.label === e.target.value);

    this.form.patchValue({
      employeeId: find?.value,
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
