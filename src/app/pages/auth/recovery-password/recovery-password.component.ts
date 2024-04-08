import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { throwError } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class RecoveryPasswordComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  formBuilder = inject(FormBuilder);
  errorMessage: string = '';
  successMessage: string = '';

  form: FormGroup;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Validación de correo electrónico requerido y con formato válido
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.errorMessage = '';

    this.dataService.post(`auth/RecoverPassword`, this.form.value).subscribe(
      () => {
        // Manejar el éxito de la solicitud si es necesario
        this.successMessage =
          'Revisa tu correo electrónico, y sigue las intrucciones para restablecer tu contraseña';
      },
      (error) => {
        // Manejar el error
        this.handleError(error);
      }
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
    }
    console.error(errorMessage);
    this.errorMessage = errorMessage;
    // Lanzar el error para que pueda ser manejado por el componente o servicio que llamó a este método
    return throwError(errorMessage);
  }
}
