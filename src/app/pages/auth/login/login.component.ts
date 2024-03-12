import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import {
  ApiRequestService,
  SecurityService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  public apiRequestService = inject(ApiRequestService);

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
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.apiRequestService
      .onPostLogin('Auth/login', this.form.value)
      .then((result: any) => {
        this.onRemember(this.form.get('remember').value);
        this.router.navigateByUrl(localStorage.getItem('currentUrl'));
        this.securityService.setAuthData(result.token);
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
}
