import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import CustomInputModule from "src/app/custom-components/custom-input-form/custom-input.module";

@Component({
  selector: "app-form-control-prestamo-herramienta",
  templateUrl: "./form-control-prestamo-herramienta.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormControlPrestamoHerramientaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  cb_applicationUser: ISelectItem[] = [];
  cb_tool: any[] = [];
  today: string = "";
  form: FormGroup;

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(
        `ApplicationUser/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.cb_applicationUser = response;
      });

    this.apiRequestService
      .onGetSelectItem(`tool/${this.customerIdService.getCustomerId()}`)
      .then((response: any) => {
        this.cb_tool = response;
      });

    this.today = new Date().toISOString().slice(0, 16);
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      customerId: [this.customerIdService.customerId],
      fechaSalida: [this.today, Validators.required],
      fechaRegreso: [],
      applicationUserId: ["", Validators.required],
      applicationUser: ["", Validators.required],
      toolId: ["", Validators.required],
      tool: ["", Validators.required],
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
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      this.form.patchValue({
        applicationUser: result.applicationUser,
      });
      this.form.patchValue({
        applicationUserId: result.applicationUserId,
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
        .onPost(`controlprestamoherramientas`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`controlprestamoherramientas/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
