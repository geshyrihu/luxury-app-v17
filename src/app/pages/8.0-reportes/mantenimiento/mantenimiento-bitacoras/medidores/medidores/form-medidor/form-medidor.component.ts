import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import CustomInputModule from "src/app/custom-components/custom-input-form/custom-input.module";

@Component({
  selector: "app-form-medidor",
  templateUrl: "./form-medidor.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormMedidorComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  cb_nombreMedidorCategoria: any[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    medidorActivo: [true],
    fechaRegistro: [""],
    consumoDiarioMaximo: [0, Validators.required],
    medidorCategoriaId: ["", Validators.required],
    numeroMedidor: ["", Validators.required],
    descripcion: ["", Validators.required],
    customerId: [this.custIdService.customerId],
  });

  ngOnInit(): void {
    this.onSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`MedidorCategoria`)
      .then((response: any) => {
        this.cb_nombreMedidorCategoria = response;
      });
  }
  onLoadData() {
    const urlApi = `Medidor/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Medidor`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Medidor/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
