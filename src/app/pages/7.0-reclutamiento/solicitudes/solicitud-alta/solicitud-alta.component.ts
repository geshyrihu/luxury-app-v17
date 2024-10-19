import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETypeContractRegister } from 'src/app/core/enums/type-contract-register.enum';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
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
export default class SolicitudAltaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  requestPositionCandidateId: number = 0;
  data: any;
  submitting: boolean = false;

  cb_typeContractRegister = onGetSelectItemFromEnum(ETypeContractRegister);
  cb_vacantes: ISelectItem[] = [];

  employeeId = this.config.data.employeeId;
  customerId = this.config.data.customerId;

  form: FormGroup = this.formBuilder.group({
    positionRequestId: ['', Validators.required],
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
    const urlApi = `RequestEmployeeRegister/GetEmployeeRegister/${this.employeeId}/${this.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.form.patchValue(result);
      this.form.patchValue({
        employeeId: this.config.data.employeeId,
        positionRequestId: '',
      });
    });

    console.log(this.form.value);
  }

  onLoadDataVacante() {
    const urlApi = `requestemployeeregister/vacantes/${this.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_vacantes = result;
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    // Mostrar un mensaje de carga

    var urlApi = `solicitudesreclutamiento/solicitudalta/${this.authService.applicationUserId}`;
    this.apiRequestService
      .onPost(urlApi, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
