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
import { ETypeContractRegister } from 'src/app/core/enums/type-contract-register.enum';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ValidationErrorsCustomInputComponent from 'src/app/custom-components/custom-input-form/validation-errors-custom-input/validation-errors-custom-input.component';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-solicitud-alta',
  templateUrl: './solicitud-alta.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
    ValidationErrorsCustomInputComponent,
  ],
})
export default class SolicitudAltaComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private enumService = inject(EnumService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  requestPositionCandidateId: number = 0;
  data: any;
  submitting: boolean = false;

  subRef$: Subscription;
  cb_typeContractRegister = onGetSelectItemFromEnum(ETypeContractRegister);
  cb_vacantes: ISelectItemDto[] = [];

  employeeId = this.config.data.employeeId;
  customerId = this.config.data.customerId;

  form: FormGroup = this.formBuilder.group({
    positionRequestId: [null, Validators.required],
    boss: ['', Validators.required],
    candidateName: ['', Validators.required],
    customerAddress: ['', Validators.required],
    typeContractRegister: [ETypeContract.Interno, Validators.required],
    employeeId: [this.config.data.employeeId, Validators.required],
    additionalInformation: [],
  });

  ngOnInit(): void {
    this.onLoadDataVacante();
    this.onLoadData();
  }

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    // this.enumService
    //   .getEnumValuesDisplay('ETypeContractRegister')
    //   .subscribe((resp) => {
    //     this.cb_typeContractRegister = resp;
    //   });
    this.subRef$ = this.dataService
      .get(
        `RequestEmployeeRegister/GetEmployeeRegister/${this.employeeId}/${this.customerId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.form.patchValue(resp.body);
          this.form.patchValue({
            employeeId: this.config.data.employeeId,
          });
        },

        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onLoadDataVacante() {
    this.subRef$ = this.dataService
      .get(`requestemployeeregister/vacantes/${this.customerId}`)
      .subscribe({
        next: (resp: any) => {
          this.cb_vacantes = resp.body;
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

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .post(
        `solicitudesreclutamiento/solicitudalta/${this.authService.infoUserAuthDto.applicationUserId}`,
        this.form.value
      )
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
