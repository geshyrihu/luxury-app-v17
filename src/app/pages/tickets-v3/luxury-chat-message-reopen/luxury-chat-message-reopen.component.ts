import { CommonModule } from '@angular/common';
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
  selector: 'app-luxury-chat-message-reopen',
  templateUrl: './luxury-chat-message-reopen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
})
export default class LuxuryChatMessageReopenComponent implements OnInit {
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    applicationUserId: new FormControl(
      this.authService.applicationUserId,
      Validators.required
    ),
    luxuryChatGroupMessageId: new FormControl(
      this.config.data.id,
      Validators.required
    ),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(150),
    ]),
    userCreateId: [this.authService.applicationUserId, Validators.required],
  });
  ngOnInit() {}

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    this.apiRequestService
      .onPost(`LuxuryChatMessage/Reopen`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
