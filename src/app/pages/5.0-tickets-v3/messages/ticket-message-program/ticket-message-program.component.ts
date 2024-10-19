import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-ticket-message-program',
  templateUrl: './ticket-message-program.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class TicketMessageProgramComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  customerIdService = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = this.config.data.id;
  submitting: boolean = false;

  cb_user: any[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    scheduledDate: [new Date(), Validators.required],
    assigneeId: ['', Validators.required],
    assignee: ['', Validators.required],
    applicationUserId: [
      this.authService.applicationUserId,
      Validators.required,
    ],
  });

  ngOnInit() {
    console.log('this.config.data', this.config.data);

    this.onLoadUsers();
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TicketMessage/Programation/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue({
        assignee: result.assignee,
        assigneeId: result.assigneeId,
      });
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestService
      .onPost(`TicketMessage/Programation/${this.id}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onLoadUsers() {
    const urlApi = `TicketMessage/Participant/${this.config.data.ticketGroupId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_user = result;
    });
  }

  public saveUserId(e: any): void {
    let find = this.cb_user.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      assigneeId: find?.value,
    });
  }
}
