import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ComponentsModule from 'app/shared/components.module';
import { Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  DataService,
  SecurityService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputModule,
    ComponentsModule,
  ],
})
export default class LoginComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  fieldTextType!: boolean;
  form: FormGroup;

  returnUrl: string;

  ngOnInit(): void {
    // Captura el returnUrl de los queryParams o asigna '/' por defecto
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // Inicializa el formulario al cargar el componente
    this.onLoadForm();
    // Reinicia los datos de autenticación
    this.securityService.resetAuthData();
  }

  onSubmit() {
    // Verifica si el formulario es inválido y marca todos los campos como tocados si es así
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
        return;
      });
    }
    // Muestra un mensaje de carga
    this.customToastService.onLoading();
    // Realiza la solicitud de inicio de sesión
    this.dataService
      .post('Auth/login', this.form.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          // Guarda los datos de autenticación y redirige al 'returnUrl'
          this.onRemember(this.form.get('remember').value);
          this.router.navigateByUrl(localStorage.getItem('currentUrl'));

          // //TODO: Cambiar la redirección al dashboard
          // this.router.navigateByUrl(localStorage.getItem('dashboard'));
          this.securityService.setAuthData(resp.body.token);
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
          this.customToastService.onLoadingError(error.error['description']);
        },
      });
  }

  onRemember(remember: boolean) {
    // Almacena o elimina el email y la contraseña en el localStorage según la opción 'remember'
    if (remember) {
      localStorage.setItem('email', this.form.controls.email.value);
      localStorage.setItem('password', this.form.controls.password.value);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }

  onLoadForm() {
    // Carga los valores de email y password desde el localStorage al inicializar el formulario
    this.form = this.formBuilder.group({
      email: [localStorage.getItem('email') || '', Validators.required],
      password: [localStorage.getItem('password') || '', Validators.required],
      remember: [true],
    });
  }

  /**
   * Alternar la visibilidad de la contraseña
   */
  toggleFieldTextType() {
    // Cambia el estado de visualización de la contraseña
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  onRecoveryPassword() {
    // Navega a la página para recuperar contraseña
    this.router.navigate(['/auth/recuperar-contrasena']);
  }
}
