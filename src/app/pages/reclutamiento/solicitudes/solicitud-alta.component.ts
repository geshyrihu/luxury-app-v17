import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-alta',
  templateUrl: './solicitud-alta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [DataConnectorService, EnumSelectService],
})
export default class SolicitudAltaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  requestPositionCandidateId: number = 0;
  data: any;
  submitting: boolean = false;

  cb_typeContractRegister = [];
  cb_vacantes: ISelectItem[] = [];

  employeeId = this.config.data.employeeId;
  customerId = this.config.data.customerId;

  form: FormGroup = this.formB.group({
    positionRequestId: ['', Validators.required],
    boss: ['', Validators.required],
    candidateName: ['', Validators.required],
    customerAddress: ['', Validators.required],
    typeContractRegister: [0, Validators.required],
    employeeId: [this.config.data.employeeId, Validators.required],
    additionalInformation: [],
  });

  async ngOnInit() {
    this.cb_typeContractRegister =
      await this.enumSelectS.typeContractRegister();
    this.onLoadDataVacante();
    this.onLoadData();
  }

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    const urlApi = `RequestEmployeeRegister/GetEmployeeRegister/${this.employeeId}/${this.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
      this.form.patchValue({
        employeeId: this.config.data.employeeId,
        positionRequestId: '',
      });
    });
  }

  onLoadDataVacante() {
    const urlApi = `requestemployeeregister/vacantes/${this.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_vacantes = responseData;
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    // Mostrar un mensaje de carga

    var urlApi = `solicitudesreclutamiento/solicitudalta/${this.authS.applicationUserId}`;
    this.apiRequestS
      .onPost(urlApi, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
