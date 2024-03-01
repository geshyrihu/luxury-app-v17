import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EState } from 'src/app/core/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
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
  selector: 'app-addoredit-entrega-recepcion-cliente',
  templateUrl: './addoredit-entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CrudEntregaRecepcionClienteComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  id: number = 0;

  cb_estatus: ISelectItemDto[] = onGetSelectItemFromEnum(EState);
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    observaciones: [''],
    archivo: [''],
    estatus: [EState.Activo],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
  });

  submitting: boolean = false;

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadData();
  }

  onSubmit() {
    this.id = this.config.data.id;
    if (!this.apiRequestService.validateForm(this.form)) return;

    const model = this.onCreateFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .put(
        `EntregaRecepcionCliente/${this.id}/${
          this.authService.userTokenDto.infoEmployeeDto.employeeId
        }/${this.customerIdService.getcustomerId()}`,
        model
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
  onLoadData() {
    this.dataService
      .get(`EntregaRecepcionDescripcion/${this.id}`)
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
  change(file: any) {
    this.form.patchValue({ archivo: file });
    this.submitting = true;
  }
  get f() {
    return this.f.form.controls;
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('estatus', String(dto.estatus));
    formData.append('userId', dto.userId);
    formData.append('observaciones', String(dto.observaciones));
    if (dto.archivo) {
      formData.append('archivo', dto.archivo);
    }
    return formData;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
