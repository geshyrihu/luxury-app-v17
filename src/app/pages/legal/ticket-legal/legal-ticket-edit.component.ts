import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-legal-ticket-edit',
    templateUrl: './legal-ticket-edit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class LegalTicketEditComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  public auhtService = inject(AuthService);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  cb_customer: ISelectItem[] = [];

  id: string = '';
  submitting: boolean = false;
  applicationUserResponsible_cb: ISelectItem[] = [];
  list: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: ['', Validators.required],
    request: [],
    title: ['', Validators.required],
    documentCloud: [false],
    documentEmail: [false],
    personResponsibleId: [null],
    applicationUserResponsibleId: [null],
  });

  cb_legal_matter: ISelectItem[] = [];
  ngOnInit() {
    this.apiRequestS.onGetSelectItem(`NombreCorto`).then((resp: any) => {
      this.cb_customer = resp;
    });

    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.apiRequestS
      .onGetItem(`TicketLegal/EmployeeLegal`)
      .then((responseData: any) => {
        this.applicationUserResponsible_cb = responseData;
      });
  }
  onLoadData() {
    this.onLegalMatter();
    this.apiRequestS
      .onGetItem(`TicketLegal/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;
    this.submitting = true;

    this.apiRequestS
      .onPut(`TicketLegal/${this.id}`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
  onLegalMatter() {
    const urlApi = `LegalMatter/SelectForAddTicket`;

    this.apiRequestS.onGetList(urlApi).then((responseData: ISelectItem[]) => {
      this.cb_legal_matter = responseData;
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
