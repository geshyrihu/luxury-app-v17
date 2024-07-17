import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IEmailDataAddOrEdit } from 'src/app/core/interfaces/email-data-add-or-edit.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-email-data',
  templateUrl: './addoredit-email-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditEmailDataComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  applicationUserId: string = '';
  testEmailMessage: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control({
      value: this.id,
      disabled: true,
    }),
    applicationUserId: [this.config.data.applicationUserId],
    applicationUser: [this.config.data.applicationUser],
    port: ['', [Validators.required]],
    smtp: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== null) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList<IEmailDataAddOrEdit>(`EmailData/${this.id}`)
      .then((result: any) => {
        if (result !== null) {
          this.form.patchValue(result);
          this.id = result.id;
        }
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`EmailData`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`EmailData/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  TestEmail(): void {
    this.submitting = true;

    var urlApi = `SendEmail/TestEmail/${this.id}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.testEmailMessage = result.message;
      this.submitting = false;
    });
  }
}
