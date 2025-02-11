import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { catchError, throwError } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { SecurityService } from 'src/app/core/services/security.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class LoginComponent implements OnInit {
  activateRoute = inject(ActivatedRoute);
  apiRequestS = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  dataConnectorS = inject(DataConnectorService);
  formB = inject(FormBuilder);
  router = inject(Router);
  securityService = inject(SecurityService);
  authS = inject(AuthService);

  errorMessage: string = '';

  fieldTextType!: boolean;
  form: FormGroup;

  returnUrl: string;

  ngOnInit(): void {
    // Captura el returnUrl de los queryParams o asigna '/' por defecto
    this.returnUrl =
      this.activateRoute.snapshot.queryParams['returnUrl'] || '/';
    // Inicializa el formulario al cargar el componente
    this.onLoadForm();
    // Reinicia los datos de autenticación
    this.securityService.resetAuthData();
  }
  onSubmit() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere, por favor...',
    });
    Swal.showLoading();

    this.dataConnectorS
      .post('Auth/login', this.form.value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Captura el mensaje de error
          const errorDescription =
            error.error?.description ||
            `Ha ocurrido un error inesperado.
            Revisa tu conexión a internet y vuelve a intentarlo.`;

          this.errorMessage = errorDescription;
          return throwError(() => new Error(errorDescription));
        })
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body === null) {
            // Captura el mensaje de error
            const errorDescription = `Ha ocurrido un error inesperado.
            Revisa con tu Administrador tengas los permisos correspondientes.`;

            this.errorMessage = errorDescription;
            return throwError(() => new Error(errorDescription));
          }
          if (resp.body.token != null) {
            this.onRemember(this.form.get('remember').value);
            this.securityService.setAuthData(resp.body.token);
            this.customToastService.onCloseToSuccess();

            // Redirigir a la URL original o a una predeterminada si no hay una
            const redirectUrl = this.authS.redirectUrl || '/dashboard';
            // const redirectUrl = this.authS.redirectUrl || '/home';
            this.router.navigateByUrl(redirectUrl);

            // Limpiar la URL de redirección
            this.authS.redirectUrl = null;
          }
        },
        error: () => {
          Swal.close(); // Cierra el modal si ocurre un error
        },
        complete: () => Swal.close(), // Cierra el modal al finalizar
      });
  }

  onRemember(remember: boolean) {
    // Almacena o elimina el email y la contraseña en el localStorage según la opción 'remember'
    if (remember) {
      localStorage.setItem('userName', this.form.controls.userName.value);
      localStorage.setItem('password', this.form.controls.password.value);
    } else {
      localStorage.removeItem('userName');
      localStorage.removeItem('password');
    }
  }

  onLoadForm() {
    // Carga los valores de userName y password desde el localStorage al inicializar el formulario
    this.form = this.formB.group({
      userName: [localStorage.getItem('userName') || '', Validators.required],
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
