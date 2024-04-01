import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-legal-ticket-edit',
  templateUrl: './legal-ticket-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class LegalTicketEditComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  public auhtService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;
  employee: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    request: [],
    documentCloud: [false],
    documentEmail: [false],
    personResponsibleId: [null],
  });
  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.apiRequestService
      .onGetItem(`TicketLegal/EmployeeLegal`)
      .then((result: any) => {
        this.employee = result;
      });
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`TicketLegal/${this.id}`)
      .then((result: any) => {
        console.log('🚀 ~ result:', result);
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    console.log(this.form.value);
    this.id = this.config.data.id;
    this.submitting = true;

    this.apiRequestService
      .onPut(`TicketLegal/${this.id}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
