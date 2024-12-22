import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IResetPassword } from 'src/app/core/interfaces/reset-password.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import CBtnModule from 'src/app/custom-components/custom-buttons/btn.module';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-restaurar-contraseña',
  templateUrl: './restaurar-contraseña.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomInputModule, CBtnModule],
  providers: [MessageService, CustomToastService],
})
export default class RestaurarContraseñaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  subRef$: Subscription;
  form: FormGroup;
  private _fieldTextType!: boolean;
  public get fieldTextType(): boolean {
    return this._fieldTextType;
  }
  public set fieldTextType(value: boolean) {
    this._fieldTextType = value;
  }

  public token: string = '';
  public data: IResetPassword;

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((resp) => {
      this.token = resp['token'];
    });

    const paramToken = this.activatedRoute.snapshot['queryParams'];
    this.token = paramToken.token;

    this.form = this.formBuilder.group(
      {
        userName: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.data = {
      userName: this.form.get('userName').value,
      password: this.form.get('password').value,
      token: this.token,
    };

    this.apiRequestService.onPost('Auth/ResetPassword', this.data).then((_) => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  passwordMatchValidator(formGroup: UntypedFormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ passwordMatch: true });
    } else {
      formGroup.get('confirmPassword').setErrors(null);
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
