import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-ticket-message-reopen',
    templateUrl: './ticket-message-reopen.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class TicketMessageReopenComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    applicationUserId: new FormControl(
      this.authS.applicationUserId,
      Validators.required
    ),
    ticketMessageId: new FormControl(this.config.data.id, Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(150),
    ]),
    userCreateId: [this.authS.applicationUserId, Validators.required],
  });
  ngOnInit() {}

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestS
      .onPost(`Tickets/Reopen`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
