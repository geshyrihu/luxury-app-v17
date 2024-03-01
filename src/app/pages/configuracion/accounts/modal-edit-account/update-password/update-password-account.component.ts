import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ResetPasswordDto } from 'src/app/core/interfaces/user-info.interface';
import { ApiRequestService } from 'src/app/core/services/common-services';
@Component({
  selector: 'app-update-password-account',
  templateUrl: './update-password-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdatePasswordAccountComponent implements OnInit {
  public apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;

  @Input()
  applicationUserId: string = '';
  userInfoDto: ResetPasswordDto;

  form: FormGroup;
  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(this.applicationUserId),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*\/])/),
      ]),
    });
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;

    this.apiRequestService
      .onPost('Auth/ResetPasswordAdmin', this.form.value)
      .then((result: boolean) => {
        if (result) {
          this.submitting = false;
          this.form.reset();
        }
      });
  }
}
