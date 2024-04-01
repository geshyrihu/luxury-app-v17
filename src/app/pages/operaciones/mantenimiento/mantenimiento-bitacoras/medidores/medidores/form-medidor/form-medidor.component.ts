import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IMedidorLectura } from 'src/app/core/interfaces/medidor-lectura.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
@Component({
  selector: 'app-form-medidor',
  templateUrl: './form-medidor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormMedidorComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;
  cb_nombreMedidorCategoria: any[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    medidorActivo: [true],
    fechaRegistro: [''],
    consumoDiarioMaximo: [0, Validators.required],
    medidorCategoriaId: ['', Validators.required],
    numeroMedidor: ['', Validators.required],
    descripcion: ['', Validators.required],
    customerId: [this.customerIdService.customerId],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
  });

  ngOnInit(): void {
    this.onSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`MedidorCategoria`)
      .then((response: any) => {
        this.cb_nombreMedidorCategoria = response;
      });
  }
  onLoadData() {
    this.dataService
      .get<IMedidorLectura>(`Medidor/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`Medidor`, this.form.value)
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
        .put(`Medidor/${this.id}`, this.form.value)
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
