import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ResetPasswordDto } from 'src/app/core/interfaces/user-info.interface';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class UpdatePasswordModalComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;
  applicationUserId: string = this.config.data.applicationUserId;
  userInfoDto: ResetPasswordDto;

  form: FormGroup;

  correoPersonal: string = '';
  celularPersonal: string = '';

  ngOnInit(): void {
    this.onLoadDataEmployee();
    this.form = new FormGroup({
      id: new FormControl(this.applicationUserId),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*\/])/),
      ]),
    });
  }

  onLoadDataEmployee() {
    this.dataService
      .get(
        `Employees/DataEmployeeForRecoveryPassword/${this.applicationUserId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.correoPersonal = resp.body.correoPersonal;
            this.celularPersonal = resp.body.celularPersonal;
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.submitting = true;
    this.dataService
      .post('Auth/ResetPasswordAdmin', this.form.value)
      .pipe(
        takeUntil(this.destroy$), // Cancelar la suscripción cuando el componente se destruye
        finalize(() => {
          // Habilitar el botón al finalizar el envío del formulario
          this.submitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  SendPasswordNewEmail() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        'Auth/SendPasswordNewEmail/' +
          this.correoPersonal +
          '/' +
          this.applicationUserId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  SendPasswordWhatsApp() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        'Auth/SendPasswordWhatsApp/' +
          this.celularPersonal +
          '/' +
          this.applicationUserId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
