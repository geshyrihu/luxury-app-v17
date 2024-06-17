import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IResetPassword } from 'src/app/core/interfaces/reset-password.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdatePasswordModalComponent implements OnInit {
  customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  applicationUserId: string = this.config.data.applicationUserId;
  submitting: boolean = false;
  userInfoDto: IResetPassword;

  form: FormGroup;

  correoPersonal: string = '';
  celularPersonal: string = '';

  ngOnInit(): void {
    this.onLoadDataEmployee();
    this.form = new FormGroup({
      id: new FormControl(this.applicationUserId),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*\/])/),
      ]),
    });
  }

  onLoadDataEmployee() {
    this.apiRequestService
      .onGetItem(
        `Employees/DataEmployeeForRecoveryPassword/${this.applicationUserId}`
      )
      .then((result: any) => {
        if (result !== null) {
          this.correoPersonal = result.correoPersonal;
          this.celularPersonal = result.celularPersonal;
        }
      });
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.submitting = true;

    this.apiRequestService
      .onPost('Auth/ResetPasswordAdmin', this.form.value)
      .then(() => {
        this.submitting = false;
      });
  }

  SendPasswordNewEmail() {
    this.customToastService.onLoading();

    this.apiRequestService
      .onGetItem(
        'Auth/SendPasswordNewEmail/' +
          this.correoPersonal +
          '/' +
          this.applicationUserId
      )
      .then(() => {
        this.customToastService.onCloseToSuccess();
      });
  }
  SendPasswordWhatsApp() {
    this.customToastService.onLoading();

    this.apiRequestService
      .onGetItem(
        'Auth/SendPasswordWhatsApp/' +
          this.celularPersonal +
          '/' +
          this.applicationUserId
      )
      .then(() => {
        this.customToastService.onCloseToSuccess();
      });
  }
}
