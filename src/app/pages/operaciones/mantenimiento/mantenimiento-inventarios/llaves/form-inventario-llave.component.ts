import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IInventarioLlaveAddOrEditDto } from 'src/app/core/interfaces/IInventarioLlaveAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-form-inventario-llave',
  templateUrl: './form-inventario-llave.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormInventarioLlaveComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public authService = inject(AuthService);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

  id: number = 0;

  cb_equipoClasificacion: ISelectItemDto[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.getcustomerId(), [Validators.required]],
    descripcion: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    numeroLlave: ['', [Validators.required]],
    cantidad: ['', [Validators.required]],
    equipoClasificacionId: ['', [Validators.required]],
    applicationUserId: [
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
      [Validators.required],
    ],
  });

  ngOnInit() {
    this.onLoadEquipoClasificacion();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get<IInventarioLlaveAddOrEditDto>(`InventarioLlave/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`InventarioLlave`, this.form.value)
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
        .put(`InventarioLlave/${this.id}`, this.form.value)
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
  onLoadEquipoClasificacion() {
    this.dataService
      .get('EquipoClasificacion/SelectItem')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_equipoClasificacion = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
}
