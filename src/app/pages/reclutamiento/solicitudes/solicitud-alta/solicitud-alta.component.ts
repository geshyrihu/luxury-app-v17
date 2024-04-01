import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ETypeContractRegister } from 'src/app/core/enums/type-contract-register.enum';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ValidationErrorsCustomInputComponent from 'src/app/custom-components/custom-input-form/validation-errors-custom-input/validation-errors-custom-input.component';

@Component({
  selector: 'app-solicitud-alta',
  templateUrl: './solicitud-alta.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CustomInputModule,
    ValidationErrorsCustomInputComponent,
  ],
  providers: [DataService],
})
export default class SolicitudAltaComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  dataService = inject(DataService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  requestPositionCandidateId: number = 0;
  data: any;
  submitting: boolean = false;

  cb_typeContractRegister = onGetSelectItemFromEnum(ETypeContractRegister);
  cb_vacantes: ISelectItem[] = [];

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
    this.dataService
      .get(
        `RequestEmployeeRegister/GetEmployeeRegister/${this.employeeId}/${this.customerId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.form.patchValue(resp.body);
          this.form.patchValue({
            employeeId: this.config.data.employeeId,
          });
        },

        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadDataVacante() {
    this.dataService
      .get(`requestemployeeregister/vacantes/${this.customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_vacantes = resp.body;
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
        `solicitudesreclutamiento/solicitudalta/${this.authService.infoUserAuthDto.applicationUserId}`,
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
