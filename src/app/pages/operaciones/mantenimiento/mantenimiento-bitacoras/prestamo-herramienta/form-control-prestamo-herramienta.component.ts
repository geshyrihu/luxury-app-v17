import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-control-prestamo-herramienta',
  templateUrl: './form-control-prestamo-herramienta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormControlPrestamoHerramientaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  cb_employee: any[] = [];
  cb_tool: any[] = [];
  today: string = '';
  form: FormGroup;

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(`Employee/${this.customerIdService.getcustomerId()}`)
      .then((response: any) => {
        this.cb_employee = response;
      });

    this.apiRequestService
      .onGetSelectItem(`tool/${this.customerIdService.getcustomerId()}`)
      .then((response: any) => {
        this.cb_tool = response;
      });

    this.today = new Date().toISOString().slice(0, 16);
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerIdService.customerId],
      fechaSalida: [this.today, Validators.required],
      fechaRegreso: [],
      employeeId: ['', Validators.required],
      employee: ['', Validators.required],
      toolId: ['', Validators.required],
      tool: ['', Validators.required],
      observaciones: [],
      employeeResponsableId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
      ],
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
    let find = this.cb_employee.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      employeeId: find?.value,
    });
  }
  get f() {
    return this.form.controls;
  }
  onLoadData() {
    const urlApi = `banks/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      this.form.patchValue({
        employee: result.employee,
      });
      this.form.patchValue({
        employeeId: result.employeeId,
      });
      this.form.patchValue({
        tool: result.tool,
      });
      this.form.patchValue({
        toolId: result.toolId,
      });
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`ControlPrestamoHerramientas`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`ControlPrestamoHerramientas/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
