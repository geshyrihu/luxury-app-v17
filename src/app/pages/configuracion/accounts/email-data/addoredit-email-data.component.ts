import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EmailDataAddOrEditDto } from 'src/app/core/interfaces/email-data-add-or-edit.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-email-data',
  templateUrl: './addoredit-email-data.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditEmailDataComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public authService = inject(AuthService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: number = 0;
  applicationUserId: number = 0;
  testEmailMessage: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: this.formBuilder.control({
      value: this.id,
      disabled: true,
    }),
    applicationUserId: [this.config.data.applicationUserId],
    port: ['', [Validators.required]],
    smtp: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`EmailData`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`EmailData/${this.id}`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  TestEmail(): void {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        `SendEmail/TestEmail/${this.applicationUserId}/${this.authService.infoEmployeeDto.personId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.testEmailMessage = resp.body.message;
          this.customToastService.onClose();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    if (this.applicationUserId !== null) this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get<EmailDataAddOrEditDto>(
        `EmailData/GetByAccountId/${this.applicationUserId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.form.patchValue(resp.body);
            this.id = resp.body.id;
          }
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
