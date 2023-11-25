import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
  SecurityService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
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
  providers: [MessageService, CustomToastService],
})
export default class LoginComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  public customToastService = inject(CustomToastService);

  fieldTextType!: boolean;
  form: FormGroup;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .post('Auth/login', this.form.value)
      .subscribe({
        next: (resp: any) => {
          // Guarda los datos de autenticación y redirige al 'returnUrl'
          this.onRemember(this.form.get('remember').value);
          this.router.navigateByUrl(localStorage.getItem('currentUrl'));
          this.securityService.setAuthData(resp.body.token);
          this.customToastService.onClose();
        },
        error: (err) => {
          // Maneja los errores y muestra mensajes de error
          console.log(err.error);
          this.customToastService.onClose();
          this.customToastService.onLoadingError(err.error['description']);
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
    // Desuscribe la subscripción para evitar fugas de memoria
    if (this.subRef$) this.subRef$.unsubscribe();
  }

  onRecoveryPassword() {
    // Navega a la página para recuperar contraseña
    this.router.navigate(['/auth/recuperar-contrasena']);
  }
}
