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
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-solicitud-alta',
  templateUrl: './addoredit-solicitud-alta.component.html',
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
export default class AddOrEditSolicitudAltaComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);
  private enumService = inject(EnumService);

  submitting: boolean = false;
  empleados: ISelectItemDto[] = [];
  // cb_status = onGetSelectItemFromEnum(EStatus);
  cb_status: ISelectItemDto[] = [];
  // cb_typeContractRegister = onGetSelectItemFromEnum(ETypeContractRegister);
  cb_typeContractRegister = [];
  id: number = 0;
  subRef$: Subscription;
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
    this.enumService
      .getEnumValuesDisplay('ETypeContractRegister')
      .subscribe((resp) => {
        this.cb_typeContractRegister = resp;
      });
    this.enumService.getEnumValuesDisplay('EStatus').subscribe((resp) => {
      this.cb_status = resp;
    });
    this.subRef$ = this.dataService
      .get(`RequestEmployeeRegister/${this.id}`)
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
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onLoadEmpleados() {
    this.enumService.getEnumValuesDisplay('EStatus').subscribe((resp) => {
      this.cb_status = resp;
    });
    this.subRef$ = this.dataService.get(`Employees/EmployeeTemp`).subscribe({
      next: (resp: any) => {
        this.empleados = resp.body;
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

    this.form.patchValue({
      requestPositionCandidateId: null,
    });
    this.submitting = true;
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`RequestEmployeeRegister`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`RequestEmployeeRegister/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
