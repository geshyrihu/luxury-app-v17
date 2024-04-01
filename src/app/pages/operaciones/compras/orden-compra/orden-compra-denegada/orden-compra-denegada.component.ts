import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-denegada',
  templateUrl: './orden-compra-denegada.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraDenegadaComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  ordenCompraId: number = 0;
  ordenCompraAuthId: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: [],
    ordenCompraId: [],
    fechaAutorizacion: [],
    statusOrdenCompra: [],
    observaciones: [''],
    applicationUserAuthId: [],
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.ordenCompraAuthId = this.config.data.ordenCompraAuthId;
    this.form = this.formBuilder.group({
      id: [this.ordenCompraAuthId],
      ordenCompraId: [this.ordenCompraId],
      fechaAutorizacion: [''],
      statusOrdenCompra: [1],
      observaciones: ['', Validators.required],
      applicationUserAuthId: [
        this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
      ],
    });
  }

  onSubmit() {
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .put(
        `OrdenCompraAuth/NoAutorizada/${this.ordenCompraAuthId}/${this.authService.userTokenDto.infoEmployeeDto.employeeId}`,
        this.form.value
      )
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

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
