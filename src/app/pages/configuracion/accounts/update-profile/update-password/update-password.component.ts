import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { passwordValidation } from 'src/app/core/directives/password-validation.directive';
import { ChangePassword } from 'src/app/core/interfaces/change-password.interface';
import {
  ApiRequestService,
  AuthService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdatePasswordComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);

  submitting: boolean = false;

  formUpdatePassword!: UntypedFormGroup;

  ngOnInit(): void {
    this.onCreateForm();
  }
  get f() {
    return this.formUpdatePassword.controls;
  }

  onCreateForm() {
    this.formUpdatePassword = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          {
            validators: [Validators.required, passwordValidation()],
          },
        ],
        confirm: ['', Validators.required],
      },
      {
        validators: this.passwordEqual('newPassword', 'confirm'),
      }
    );
  }

  updatePassword() {
    if (!this.apiRequestService.validateForm(this.formUpdatePassword)) return;

    const model: ChangePassword = {
      currentPassword: this.formUpdatePassword.get('currentPassword').value,
      newPassword: this.formUpdatePassword.get('newPassword').value,
    };
    const id = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.apiRequestService
      .onPut(`Users/ChangePassword/${id}`, model)
      .then((result: boolean) => {
        if (result) {
          this.submitting = false;
        }
      });
  }

  passwordEqual(pass1: string, pass2: string) {
    return (formGroup: UntypedFormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notIsEqual: true });
      }
    };
  }
  passwordNotValid() {
    const pass1 = this.formUpdatePassword.get('newPassword').value;
    const pass2 = this.formUpdatePassword.get('confirm').value;

    return pass1 !== pass2 && this.updatePassword ? true : false;
  }
}
