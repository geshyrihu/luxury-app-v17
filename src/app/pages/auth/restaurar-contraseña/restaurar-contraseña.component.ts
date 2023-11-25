import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { ResetPasswordDto } from 'src/app/core/interfaces/reset-password.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonComponent from 'src/app/shared/custom-buttons/custom-button/custom-button.component';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-restaurar-contraseña',
  templateUrl: './restaurar-contraseña.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputModule,
    CustomButtonComponent,
  ],
  providers: [MessageService, CustomToastService],
})
export default class RestaurarContraseñaComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);

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
  public data: ResetPasswordDto;

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

    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .post('Auth/ResetPassword', this.data)
      .subscribe({
        next: () => {
          this.customToastService.onClose();
          this.router.navigateByUrl('#/auth/login');
        },
        error: (err: any) => {
          this.customToastService.onLoadingError(
            'Error, ' + err.error.description
          );
        },
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
