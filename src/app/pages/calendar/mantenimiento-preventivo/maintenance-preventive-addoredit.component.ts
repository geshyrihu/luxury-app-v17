import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-maintenance-preventive-addoredit',
  templateUrl: './maintenance-preventive-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class MaintenancePreventiveAddoreditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  enumSelectService = inject(EnumSelectService);

  cb_machinery: ISelectItem[] = [];
  cb_providers: ISelectItem[] = [];
  cb_recurrencia: ISelectItem[] = [];
  cb_subCuentaId: ISelectItem[] = [];
  cb_TypeMaintance: SelectItem[] = [];

  submitting: boolean = false;

  form: FormGroup;
  id: any = 0;
  idMachinery: number = null;
  account_id = this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
  fecha: string | undefined;

  async ngOnInit() {
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
    this.cb_recurrencia = await this.enumSelectService.recurrence();
    this.cb_TypeMaintance = await this.enumSelectService.typeMaintance();

    this.idMachinery = this.config.data.idMachinery;
    if (this.config.data.fecha !== null) {
      this.fecha = this.config.data.fecha;
    }
  }

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
        `MachineriesGetAll/${this.custIdService.getCustomerId()}`
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
            typeMaintance: 0,
          });
        });
    }
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
      recurrence: [null, Validators.required],
      typeMaintance: [null, Validators.required],
      customerId: [this.custIdService.getCustomerId()],
      cuentaId: ['', Validators.required],
      // temp
      machineryName: ['', Validators.required],
      providerName: ['', Validators.required],
      cuentaName: ['', Validators.required],
      applicationUserId: [this.authS.applicationUserId],
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
    const contenidoHTML = this.form.get('activity').value;
    const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
    this.form.get('activity').patchValue(contenidoSinHTML);

    const contenidoHTML2 = this.form.get('observations').value;
    const contenidoSinHTML2 = contenidoHTML2.replace(/<[^>]*>|&nbsp;/g, '');
    this.form.get('observations').patchValue(contenidoSinHTML2);
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
