import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { ISelectItem } from '../../../core/interfaces/select-Item.interface';

@Component({
  selector: 'app-legal-ticket-add-or-edit',
  templateUrl: './legal-ticket-add.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, FlatpickrModule],
})
export default class LegalTicketAddComponent implements OnInit {
  custIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  auhtService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  cb_legal_matter: ISelectItem[] = [];
  constructor() {
    flatpickrFactory();
  }
  id: string = '';
  list: ISelectItem[] = [];
  submitting: boolean = false;
  tipoSolicitud = 1;

  cb_customer: ISelectItem[] = [];
  employee: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: ['', Validators.required],
    typeService: [0, Validators.required],
    ApplicationUserRequestId: [this.auhtService.applicationUserId],
    title: ['', Validators.required],
    isInternal: [],
    fechaAsamblea: [],
    fechaJunta: [],
    horaJunta: [],
    provider: [],
    request: [],
    condomino: [],
    documentCloud: [false],
    documentEmail: [false],
    tipoSolicitud: [this.tipoSolicitud],
  });
  ngOnInit() {
    this.onLegalMatter();
    this.apiRequestService.onGetSelectItem(`NombreCorto`).then((resp: any) => {
      this.cb_customer = resp;
    });
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.apiRequestService
      .onGetItem(`TicketLegal/EmployeeLegal`)
      .then((result: any) => {
        this.employee = result;
      });
  }
  onLegalMatter() {
    const urlApi = `LegalMatter/SelectForAddTicket`;

    this.apiRequestService.onGetList(urlApi).then((result: ISelectItem[]) => {
      this.cb_legal_matter = result;
    });
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`TicketLegal/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.tipoSolicitud = result.tipoSolicitud;
      });
  }
  onSubmit() {
    this.form.removeControl('typeService');
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    this.submitting = true;

    this.apiRequestService
      .onPost(`TicketLegal`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
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
