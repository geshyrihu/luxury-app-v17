import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { passwordValidation } from 'src/app/core/directives/password-validation.directive';
import { ChangePassword } from 'src/app/core/interfaces/change-password.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class UpdatePasswordComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;
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
    if (this.formUpdatePassword.invalid) {
      Object.values(this.formUpdatePassword.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    const model: ChangePassword = {
      currentPassword: this.formUpdatePassword.get('currentPassword').value,
      newPassword: this.formUpdatePassword.get('newPassword').value,
    };
    const id = this.authService.userTokenDto.infoUserAuthDto.applicationUserId;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put(`Users/ChangePassword/${id}`, model)
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
