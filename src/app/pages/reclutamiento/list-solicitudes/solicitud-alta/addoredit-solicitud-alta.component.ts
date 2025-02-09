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
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddOrEditSolicitudAltaComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  enumSelectService = inject(EnumSelectService);

  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;
  empleados: ISelectItem[] = [];
  cb_status: ISelectItem[] = [];
  cb_typeContractRegister: ISelectItem[] = [];
  id: number = 0;

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
  async ngOnInit() {
    this.cb_status = await this.enumSelectService.status();
    this.cb_typeContractRegister =
      await this.enumSelectService.typeContractRegister();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.onLoadEmpleados();

    const urlApi = `RequestEmployeeRegister/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      if (result.employeeId !== null) {
        let find = this.empleados.find((x) => x?.value === result.employeeId);

        this.form.patchValue({
          employee: find?.label,
        });
      }
    });
  }

  onLoadEmpleados() {
    const urlApi = `Employees/EmployeeTemp`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.empleados = result;
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
      this.apiRequestService
        .onPost(`RequestEmployeeRegister`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`RequestEmployeeRegister/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
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
