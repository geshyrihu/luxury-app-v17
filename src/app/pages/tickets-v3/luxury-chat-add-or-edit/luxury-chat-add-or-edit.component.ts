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
  selector: 'app-luxury-chat-add-or-edit',
  templateUrl: './luxury-chat-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
})
export default class LuxuryChatAddOrEditComponent implements OnInit {
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  id: number = 0;
  submitting: boolean = false;

  cb_isPublic = [
    { label: 'Publico', value: true },
    { label: 'Privado', value: false },
  ];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: new FormControl(
      this.customerIdService.customerId,
      Validators.required
    ),
    nameChat: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    isPublic: new FormControl(false),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(150),
    ]),
    userCreateId: [this.authService.applicationUserId, Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `LuxuryChatGroup/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`LuxuryChatGroup`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`LuxuryChatGroup/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
