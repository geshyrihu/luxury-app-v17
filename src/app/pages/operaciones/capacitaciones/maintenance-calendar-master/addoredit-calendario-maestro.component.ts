import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EMonth } from 'src/app/core/enums/month.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-calendario-maestro',
  templateUrl: './addoredit-calendario-maestro.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    NgSelectModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    LuxuryAppComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
})
export default class AddOrEditCalendarioMaestroComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  proveedoresSeleccionados: ISelectItemDto[] = [];
  cb_equipoCalendarioMaestro: ISelectItemDto[] = [];
  cb_providers: ISelectItemDto[] = [];
  cb_meses: ISelectItemDto[] = onGetSelectItemFromEnum(EMonth);

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    calendarioMaestroEquipoId: ['', Validators.required],
    descripcionServicio: ['', Validators.required],
    mes: [this.config.data.mes, Validators.required],
    observaciones: [''],
    proveedores: [[]],
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  get f() {
    return this.form.controls;
  }
  onLoadData(id: number) {
    this.dataService
      .get(`CalendarioMaestro/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
        this.form.patchValue({
          mes: this.config.data.mes,
        });
      });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post('CalendarioMaestro', this.form.value)
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
        .put(`CalendarioMaestro/${this.id}`, this.form.value)
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

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('EquipoCalendarioMaestro')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_equipoCalendarioMaestro = items;
      });
    this.selectItemService
      .onGetSelectItem('Providers')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_providers = resp;
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
