import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-my-ticket-message-program',
  templateUrl: './my-ticket-message-program.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class MyTicketMessageProgramComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = this.config.data.id;
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    scheduledDate: [new Date(), Validators.required],
    assigneeId: ['', Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
  });

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Tickets/Programation/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue({
        assigneeId: result.assigneeId,
      });
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestS
      .onPost(`Tickets/MyTicket/Programation/${this.id}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
