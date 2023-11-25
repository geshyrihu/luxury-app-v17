import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-bitacora-mantenimiento',
  templateUrl: './form-bitacora-mantenimiento.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class FormBitacoraMantenimientoComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  userId = '';
  form: FormGroup;
  maquinarias: any[] = [];

  formFecha: UntypedFormGroup;

  public saveMaquinariaId(e): void {
    let find = this.maquinarias.find(
      (x) => x?.nameMachinery === e.target.value
    );
    this.form.patchValue({
      machineryId: find?.id,
    });
  }
  ngOnInit(): void {
    // this.customerId = ;
    this.userId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.onLoadMachinery();
    this.form = this.formBuilder.group({
      customerId: [this.customerIdService.getcustomerId(), Validators.required],
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      descripcion: ['', Validators.required],
      emergencia: [false],
      employeeId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        Validators.required,
      ],
    });

    this.formFecha = this.formBuilder.group({
      fechaHora: [],
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
      .post(`BitacoraMantenimiento`, this.form.value)
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onClose();
        },
        error: (err) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
    this.submitting = true;
  }

  onLoadMachinery() {
    this.subRef$ = this.dataService
      .get(
        `SelectItem/ListadoInstalaciones/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          this.maquinarias = resp.body;
          this.customToastService.onClose();
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
