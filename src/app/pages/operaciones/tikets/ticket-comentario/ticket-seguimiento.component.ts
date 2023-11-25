import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ITicketseguimiento } from 'src/app/core/interfaces/ITicketseguimiento.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-ticket-seguimiento',
  templateUrl: './ticket-seguimiento.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export default class TicketSeguimientoComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);

  private customToastService = inject(CustomToastService);

  seguimientos: ITicketseguimiento[] = [];
  submitting: boolean = false;

  loading = false;
  seguimientoLenght: number = 200;
  seguimientoConst: string = '';
  weeklyReportId: number = this.config.data.id;
  id: number = 0;
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    weeklyReportId: [this.weeklyReportId, Validators.required],
    employeeId: [
      this.authService.userTokenDto.infoEmployeeDto.employeeId,
      Validators.required,
    ],
    seguimiento: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ],
    ],
  });
  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  validarCaracteres(value: any) {
    this.seguimientoLenght = 200;
    this.seguimientoLenght = this.seguimientoLenght - value.value.length;

    if (this.seguimientoConst.length > 200) {
      const valor = this.seguimientoConst.substring(0, 199);
      this.form.patchValue({
        seguimiento: valor,
      });
    }
  }

  onCargaListaseguimientos() {
    this.loading = true;
    this.subRef$ = this.dataService
      .get<ITicketseguimiento[]>(
        `TicketSeguimiento/seguimientos/${this.weeklyReportId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.seguimientos = resp.body;
          this.loading = false;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .post(`TicketSeguimiento`, this.form.value)
      .subscribe({
        next: (_) => {
          this.onCargaListaseguimientos();
          this.form.patchValue({
            seguimiento: '',
          });
          this.seguimientoLenght = 200;
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
