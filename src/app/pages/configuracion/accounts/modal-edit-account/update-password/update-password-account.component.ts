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
import { Subscription } from 'rxjs';
import { ResetPasswordDto } from 'src/app/core/interfaces/user-info.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonSubmitComponent from 'src/app/shared/custom-buttons/custom-button-submit/custom-button-submit.component';

@Component({
  selector: 'app-update-password-account',
  templateUrl: './update-password-account.component.html',
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
export default class UpdatePasswordAccountComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);

  @Input()
  applicationUserId: string = '';
  userInfoDto: ResetPasswordDto;
  subRef$: Subscription;
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
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
