import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { catchError, throwError } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class RecoveryPasswordComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  dataConnectorS = inject(DataConnectorService);
  formB = inject(FormBuilder);
  errorMessage: string = '';
  successMessage: string = '';

  form: FormGroup;
  ngOnInit(): void {
    this.form = this.formB.group({
      email: ['', [Validators.required, Validators.email]], // Validación de correo electrónico requerido y con formato válido
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = '';

    // Mostrar un mensaje de carga opcional
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Procesando solicitud...',
    });
    Swal.showLoading();

    // Realizar la solicitud POST al backend

    const urlApi = 'Auth/RecoverPassword';
    const body = this.form.value;

    this.dataConnectorS
      .post(urlApi, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message;
          Swal.close();
          return throwError(() => new Error(this.errorMessage));
        })
      )
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.body.message;
        },
        error: () => {
          // Si ocurre un error en la suscripción, asegúrate de cerrar el modal
          Swal.close();
        },
        complete: () => Swal.close(), // Cierra el modal cuando la petición finalice
      });
  }
}
