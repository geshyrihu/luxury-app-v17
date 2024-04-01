import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-catalogo-descripcion',
  templateUrl: './addoredit-catalogo-descripcion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditCatalogoDescripcionComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;

  cb_area_responsable: ISelectItem[] = [
    { value: 'CONTABLE', label: 'CONTABLE' },
    { value: 'OPERACIONES', label: ' OPERACIONES' },
    { value: 'JURIDICO', label: 'JURIDICO' },
    { value: 'MANTENIMIENTO', label: 'MANTENIMIENTO' },
  ];

  cb_grupo: ISelectItem[] = [];
  cb_state: ISelectItem[] = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' },
  ];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    folioId: ['', Validators.required],
    departamento: ['', Validators.required],
    state: [Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(4)]],
    grupo: ['', [Validators.required, Validators.minLength(4)]],
  });

  ngOnInit(): void {
    this.onLoadGrupos();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`CatalogoEntregaRecepcionDescripcion/${this.id}`)
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
  onLoadGrupos() {
    this.dataService
      .get(`CatalogoEntregaRecepcionDescripcion/grupos`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.cb_grupo = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
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
        .post(`CatalogoEntregaRecepcionDescripcion`, this.form.value)
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
        .put(`CatalogoEntregaRecepcionDescripcion/${this.id}`, this.form.value)
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
