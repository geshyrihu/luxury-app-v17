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
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  applicationUserId: string = '';
  testEmailMessage: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: this.formB.control({
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
    this.apiRequestS
      .onGetList<IEmailDataAddOrEdit>(`EmailData/${this.id}`)
      .then((responseData: any) => {
        if (responseData !== null) {
          this.form.patchValue(responseData);
          this.id = responseData.id;
        }
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`EmailData`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`EmailData/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  TestEmail(): void {
    this.submitting = true;

    var urlApi = `SendEmail/TestEmail/${this.id}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.testEmailMessage = responseData.message;
      this.submitting = false;
    });
  }
}
