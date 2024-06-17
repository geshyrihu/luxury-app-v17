import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { catchError, throwError } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SecurityService } from 'src/app/core/services/security.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class LoginComponent implements OnInit {
  activateRoute = inject(ActivatedRoute);
  apiRequestService = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  securityService = inject(SecurityService);

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
    // Verifica si el formulario es inválido y marca todos los campos como tocados si es así
    if (!this.apiRequestService.validateForm(this.form)) return;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.dataService
      .post('Auth/login', this.form.value)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Ha ocurrido un error en la solicitud.';

          if (error.error && error.error.description) {
            errorMessage = error.error.description;
          }

          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });

          // Retornar un observable con un error para que la cadena de observables continúe
          return throwError(errorMessage);
        })
      )
      .subscribe((resp: any) => {
        if (resp.body.token != null) {
          this.onRemember(this.form.get('remember').value);
          this.router.navigateByUrl(localStorage.getItem('currentUrl'));
          this.securityService.setAuthData(resp.body.token);
          this.customToastService.onCloseToSuccess();
        }
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
    this.form = this.formBuilder.group({
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
