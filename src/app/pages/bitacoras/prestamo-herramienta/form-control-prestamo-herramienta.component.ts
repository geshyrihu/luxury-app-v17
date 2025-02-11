import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-form-control-prestamo-herramienta',
    templateUrl: './form-control-prestamo-herramienta.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class FormControlPrestamoHerramientaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  cb_applicationUser: ISelectItem[] = [];
  cb_tool: any[] = [];
  today: string = '';
  form: FormGroup;

  ngOnInit(): void {
    this.apiRequestS
      .onGetSelectItem(`ApplicationUser/${this.customerIdS.getCustomerId()}`)
      .then((response: any) => {
        this.cb_applicationUser = response;
      });

    this.apiRequestS
      .onGetSelectItem(`tool/${this.customerIdS.getCustomerId()}`)
      .then((response: any) => {
        this.cb_tool = response;
      });

    this.today = new Date().toISOString().slice(0, 16);
    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerIdS.customerId],
      fechaSalida: [this.today, Validators.required],
      fechaRegreso: [],
      applicationUserId: ['', Validators.required],
      applicationUser: ['', Validators.required],
      toolId: ['', Validators.required],
      tool: ['', Validators.required],
      observaciones: [],
      applicationUserResponsableId: [this.authS.applicationUserId],
    });
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  public saveToolId(e): void {
    let find = this.cb_tool.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      toolId: find?.value,
    });
  }
  public saveEmployeeId(e): void {
    let find = this.cb_applicationUser.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      applicationUserId: find?.value,
    });
  }
  get f() {
    return this.form.controls;
  }
  onLoadData() {
    const urlApi = `controlprestamoherramientas/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
      this.form.patchValue({
        applicationUser: responseData.applicationUser,
      });
      this.form.patchValue({
        applicationUserId: responseData.applicationUserId,
      });
      this.form.patchValue({
        tool: responseData.tool,
      });
      this.form.patchValue({
        toolId: responseData.toolId,
      });
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`controlprestamoherramientas`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`controlprestamoherramientas/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
