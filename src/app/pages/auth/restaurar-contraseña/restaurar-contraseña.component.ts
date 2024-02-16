import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordDto } from 'src/app/core/interfaces/reset-password.interface';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-restaurar-contraseña',
  templateUrl: './restaurar-contraseña.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class RestaurarContraseñaComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public apiRequestService = inject(ApiRequestService);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.data = {
      userName: this.form.get('userName').value,
      password: this.form.get('password').value,
      token: this.token,
    };

    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post('Auth/ResetPassword', this.data)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
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
    this.dataService.ngOnDestroy();
  }
}
