import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-recuperar-contraseña',
  templateUrl: './recuperar-contraseña.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class RecuperarContraseñaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  form: FormGroup;
  sendEmail: boolean = false;

  ngOnInit(): void {
    this.onLoadForm();
  }

  onLoadForm() {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.required,
        ],
      ],
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post('Auth/RecoverPassword', this.form.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onClose();
          this.sendEmail = true;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLogin() {
    this.router.navigateByUrl('/auth/login');
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
