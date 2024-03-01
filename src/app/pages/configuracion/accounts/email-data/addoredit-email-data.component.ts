import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmailDataAddOrEditDto } from 'src/app/core/interfaces/email-data-add-or-edit.interface';
import {
  ApiRequestService,
  AuthService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-email-data',
  templateUrl: './addoredit-email-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditEmailDataComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  id: number = 0;
  applicationUserId: number = 0;
  testEmailMessage: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control({
      value: this.id,
      disabled: true,
    }),
    applicationUserId: [this.config.data.applicationUserId],
    port: ['', [Validators.required]],
    smtp: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    if (this.applicationUserId !== null) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList<EmailDataAddOrEditDto>(
        `EmailData/GetByAccountId/${this.applicationUserId}`
      )
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

    if (this.id === 0) {
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
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.apiRequestService
      .onGetList(
        `SendEmail/TestEmail/${this.applicationUserId}/${this.authService.infoEmployeeDto.personId}`
      )
      .then((result: any) => {
        this.testEmailMessage = result.message;
        this.submitting = false;
      });
  }
}
