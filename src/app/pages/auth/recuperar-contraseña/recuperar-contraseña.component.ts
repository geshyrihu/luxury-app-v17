import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonComponent from 'src/app/shared/custom-buttons/custom-button/custom-button.component';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-recuperar-contraseña',
  templateUrl: './recuperar-contraseña.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputModule,
    CustomButtonComponent,
  ],
  providers: [MessageService, CustomToastService],
})
export default class RecuperarContraseñaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public customToastService = inject(CustomToastService);

  form: FormGroup;
  sendEmail: boolean = false;
  subRef$: Subscription;
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
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .post('Auth/RecoverPassword', this.form.value)
      .subscribe({
        next: () => {
          this.customToastService.onClose();
          this.sendEmail = true;
        },
        error: (err) => {
          console.log(err.error);
          this.customToastService.onLoadingError(
            err.error[''].errors[0].errorMessage
          );
        },
      });
  }

  onLogin() {
    this.router.navigateByUrl('/auth/login');
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
