import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { AuthService } from "src/app/core/services/auth.service";
import CustomInputModule from "src/app/custom-components/custom-input-form/custom-input.module";

@Component({
  selector: "app-legal-ticket-edit",
  templateUrl: "./legal-ticket-edit.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class LegalTicketEditComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  public auhtService = inject(AuthService);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  cb_customer: ISelectItem[] = [];

  id: string = "";
  submitting: boolean = false;
  applicationUserResponsible_cb: ISelectItem[] = [];
  list: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: ["", Validators.required],
    request: [],
    title: ["", Validators.required],
    documentCloud: [false],
    documentEmail: [false],
    personResponsibleId: [null],
    applicationUserResponsibleId: [null],
  });

  cb_legal_matter: ISelectItem[] = [];
  ngOnInit() {
    this.apiRequestService.onGetSelectItem(`NombreCorto`).then((resp: any) => {
      this.cb_customer = resp;
    });

    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
    this.apiRequestService
      .onGetItem(`TicketLegal/EmployeeLegal`)
      .then((result: any) => {
        this.applicationUserResponsible_cb = result;
      });
  }
  onLoadData() {
    this.onLegalMatter();
    this.apiRequestService
      .onGetItem(`TicketLegal/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    this.submitting = true;

    this.apiRequestService
      .onPut(`TicketLegal/${this.id}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
  onLegalMatter() {
    const urlApi = `LegalMatter/SelectForAddTicket`;

    this.apiRequestService.onGetList(urlApi).then((result: ISelectItem[]) => {
      this.cb_legal_matter = result;
    });
  }

  saveLegalMatter(e: any): void {
    let find = this.cb_legal_matter.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      isInternal: find?.value,
      title: e.target.value,
    });
  }
}
