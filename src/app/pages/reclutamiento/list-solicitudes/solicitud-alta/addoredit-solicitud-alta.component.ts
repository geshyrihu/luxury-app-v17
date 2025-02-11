import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-solicitud-alta',
    templateUrl: './addoredit-solicitud-alta.component.html',
    imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class AddOrEditSolicitudAltaComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  enumSelectS = inject(EnumSelectService);

  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;
  empleados: ISelectItem[] = [];
  cb_status: ISelectItem[] = [];
  cb_typeContractRegister: ISelectItem[] = [];
  id: number = 0;

  form: FormGroup = this.formB.group({
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
  async ngOnInit() {
    this.cb_status = await this.enumSelectS.status();
    this.cb_typeContractRegister =
      await this.enumSelectS.typeContractRegister();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.onLoadEmpleados();

    const urlApi = `RequestEmployeeRegister/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
      if (responseData.employeeId !== null) {
        let find = this.empleados.find(
          (x) => x?.value === responseData.employeeId
        );

        this.form.patchValue({
          employee: find?.label,
        });
      }
    });
  }

  onLoadEmpleados() {
    const urlApi = `Employees/EmployeeTemp`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.empleados = responseData;
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.id = this.config.data.id;

    this.form.patchValue({
      requestPositionCandidateId: null,
    });
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`RequestEmployeeRegister`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`RequestEmployeeRegister/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
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
}
