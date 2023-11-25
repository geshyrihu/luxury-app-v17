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
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { ETurnoTrabajo } from 'src/app/core/enums/turno-trabajo.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { EnumService } from 'src/app/core/services/enum-service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-status-request-salary-modification',
  templateUrl: './addoredit-status-request-salary-modification.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditStatusRequestSalaryModificationComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  private customToastService = inject(CustomToastService);
  private enumService = inject(EnumService);

  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;

  cb_profession: ISelectItemDto[] = [];
  cb_status: ISelectItemDto[] = onGetSelectItemFromEnum(ETurnoTrabajo);
  cb_type_departure: ISelectItemDto[] = [];
  cb_si_no: ISelectItemDto[] = cb_ESiNo;

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
    this.subRef$ = this.dataService
      .get(`RequestSalaryModification/GetById/${this.id}`)
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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`RequestSalaryModification`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onClose();
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`RequestSalaryModification/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onClose();
          },
        });
    }
  }
  onProfessionSelectItem() {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
    this.enumService
      .onGetSelectItemEmun('ETypeOfDeparture')
      .subscribe((resp) => {
        this.cb_type_departure = resp;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
