import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  standalone: true,
  imports: [
    NgbModule,
    FormsModule,
    ToastModule,
    CustomButtonModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class UpdatePasswordModalComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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

    this.dataService
      .post('Auth/ResetPasswordAdmin', this.form.value)
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
