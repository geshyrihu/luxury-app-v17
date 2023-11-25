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
import { Subscription } from 'rxjs';
import { ResetPasswordDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonSubmitComponent from 'src/app/shared/custom-buttons/custom-button-submit/custom-button-submit.component';

@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  standalone: true,
  imports: [
    NgbModule,
    FormsModule,
    ToastModule,
    CustomButtonSubmitComponent,
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

  applicationUserId: string = this.config.data.applicationUserId;
  userInfoDto: ResetPasswordDto;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get(
        `Employees/DataEmployeeForRecoveryPassword/${this.applicationUserId}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.correoPersonal = resp.body.correoPersonal;
            this.celularPersonal = resp.body.celularPersonal;
          }
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .post('Auth/ResetPasswordAdmin', this.form.value)
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  SendPasswordNewEmail() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        'Auth/SendPasswordNewEmail/' +
          this.correoPersonal +
          '/' +
          this.applicationUserId
      )
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  SendPasswordWhatsApp() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        'Auth/SendPasswordWhatsApp/' +
          this.celularPersonal +
          '/' +
          this.applicationUserId
      )
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
