import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-bitacora-mantenimiento',
  templateUrl: './form-bitacora-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormBitacoraMantenimientoComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

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
      customerId: [this.customerIdService.getCustomerId(), Validators.required],
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
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(`BitacoraMantenimiento`, this.form.value)
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
    this.submitting = true;
  }

  onLoadMachinery() {
    this.dataService
      .get(
        `SelectItem/ListadoInstalaciones/${this.customerIdService.getCustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.maquinarias = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
