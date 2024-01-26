import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-update-password-account',
  templateUrl: './update-password-account.component.html',
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
export default class UpdatePasswordAccountComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  @Input()
  applicationUserId: string = '';
  userInfoDto: ResetPasswordDto;

  form: FormGroup;
  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(this.applicationUserId),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-*\/])/),
      ]),
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
