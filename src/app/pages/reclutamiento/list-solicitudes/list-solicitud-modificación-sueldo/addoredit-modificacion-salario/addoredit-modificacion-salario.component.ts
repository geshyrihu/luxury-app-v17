import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { EStatus } from 'src/app/core/enums/status.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-modificacion-salario',
  templateUrl: './addoredit-modificacion-salario.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    FlatpickrModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditModificacionSalarioComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  cb_status: ISelectItemDto[] = onGetSelectItemFromEnum(EStatus);
  cb_si_no: ISelectItemDto[] = cb_ESiNo;
  id: number = 0;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get(`requestsalarymodification/getbyid/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.subRef$ = this.dataService
      .put(`requestsalarymodification/${this.id}`, this.form.value)
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}

export interface RequestSalaryModificationAddOrEditDto {
  employeeId: number;
  workPositionId: number;
  requestDate: string;
  soport: string;
  professionCurrentId: number;
  professionNewId: number;
  currentSalary: number;
  finalSalary: number;
  executionDate: string;
  folio: string;
  retroactive: boolean;
  status: string;
  applicationUserId: string;
  confirmationFinish: boolean;
}
