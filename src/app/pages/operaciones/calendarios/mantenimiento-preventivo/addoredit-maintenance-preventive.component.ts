import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ERecurrence } from 'src/app/core/enums/recurrence.enum';
import { ETypeMaintance } from 'src/app/core/enums/type-maintance.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-maintenance-preventive',
  templateUrl: './addoredit-maintenance-preventive.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditMaintenancePreventiveComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  Editor = ClassicEditor;

  cb_machinery: ISelectItem[] = [];
  cb_providers: ISelectItem[] = [];
  cb_recurrencia: ISelectItem[] = onGetSelectItemFromEnum(ERecurrence);
  cb_subCuentaId: ISelectItem[] = [];
  cb_TypeMaintance: SelectItem[] = onGetSelectItemFromEnum(ETypeMaintance);

  submitting: boolean = false;

  form: FormGroup;
  id: any = 0;
  idMachinery: number = null;
  account_id = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  fecha: string | undefined;

  public saveMachineryId(e: any): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  public saveProviderId(e: any): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      providerId: find?.value,
    });
  }
  public saveSubCuentaId(e: any): void {
    let find = this.cb_subCuentaId.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      cuentaId: find?.value,
    });
  }
  get f() {
    return this.form.controls;
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(
        `MachineriesGetAll/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_machinery = response;
      });
    this.apiRequestService
      .onGetSelectItem('Providers')
      .then((response: any) => {
        this.cb_providers = response;
      });
    this.apiRequestService
      .onGetSelectItem('CuentasContables')
      .then((response: ISelectItem[]) => {
        this.cb_subCuentaId = response;
      });
  }

  onGetMachinerySelectItem() {
    if (this.config.data.idMachinery !== 0) {
      this.apiRequestService
        .onGetList(
          `Machineries/GetMachinerySelectItem/${this.config.data.idMachinery}`
        )
        .then((result: any) => {
          this.form.patchValue({
            machineryId: result.value,
            machineryName: result.label,
          });
          this.form.patchValue({
            typeMaintance: ETypeMaintance.Preventivo,
          });
        });
    }
  }

  ngOnInit(): void {
    this.idMachinery = this.config.data.idMachinery;
    if (this.config.data.fecha !== null) {
      this.fecha = this.config.data.fecha;
    }
    this.onLoadSelectItem();
    switch (this.config.data.task) {
      case 'create': {
        this.onGetMachinerySelectItem();
        break;
      }
      case 'edit': {
        this.onLoadData();
        break;
      }
      case 'copy': {
        this.LoadCopy();
        break;
      }
      default: {
        break;
      }
    }
    this.onLoadForm();
  }
  onLoadForm() {
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      activity: ['', Validators.required],
      machineryId: ['', Validators.required],
      fechaServicio: [this.fecha, Validators.required],
      observation: [''],
      price: ['', Validators.required],
      providerId: ['', Validators.required],
      recurrence: ['', Validators.required],
      typeMaintance: ['', Validators.required],
      customerId: [this.customerIdService.getCustomerId()],
      employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
      cuentaId: ['', Validators.required],
      // temp
      machineryName: ['', Validators.required],
      providerName: ['', Validators.required],
      cuentaName: ['', Validators.required],
    });
  }
  LoadCopy() {
    this.apiRequestService
      .onGetItem(`MaintenanceCalendars/Get/${this.config.data.id}`)
      .then((result: any) => {
        this.id = 0;
        this.onPathForm(result);
      });
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`MaintenanceCalendars/Get/${this.config.data.id}`)
      .then((result: any) => {
        this.id = result.id;
        this.onPathForm(result);
      });
  }
  onPathForm(result: any) {
    this.form.patchValue(result);
    this.form.patchValue({
      machineryId: result.machineryId.value,
    });
    this.form.patchValue({
      machineryName: result.machineryId.label,
    });
    this.form.patchValue({
      providerId: result.providerId.value,
    });
    this.form.patchValue({
      providerName: result.providerId.label,
    });
    this.form.patchValue({
      cuentaId: result.cuenta.value,
    });
    this.form.patchValue({
      cuentaName: result.cuenta.label,
    });
  }
  // convenience getter for easy access to form fields

  submit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`MaintenanceCalendars`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`MaintenanceCalendars/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
