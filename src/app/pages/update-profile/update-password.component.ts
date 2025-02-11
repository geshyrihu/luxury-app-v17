import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { passwordValidation } from "src/app/core/directives/password-validation.directive";
import { IChangePassword } from "src/app/core/interfaces/change-password.interface";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdatePasswordComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);

  submitting: boolean = false;

  formUpdatePassword!: UntypedFormGroup;

  ngOnInit(): void {
    this.onCreateForm();
  }
  get f() {
    return this.formUpdatePassword.controls;
  }

  onCreateForm() {
    this.formUpdatePassword = this.formB.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: [
          "",
          {
            validators: [Validators.required, passwordValidation()],
          },
        ],
        confirm: ["", Validators.required],
      },
      {
        validators: this.passwordEqual("newPassword", "confirm"),
      }
    );
  }

  updatePassword() {
    if (!this.apiRequestS.validateForm(this.formUpdatePassword)) return;

    const model: IChangePassword = {
      currentPassword: this.formUpdatePassword.get("currentPassword").value,
      newPassword: this.formUpdatePassword.get("newPassword").value,
    };
    const id = this.authS.userTokenDto.infoUserAuthDto.applicationUserId;

    this.submitting = true;

    this.apiRequestS
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
    const pass1 = this.formUpdatePassword.get("newPassword").value;
    const pass2 = this.formUpdatePassword.get("confirm").value;

    return pass1 !== pass2 && this.updatePassword ? true : false;
  }
}
