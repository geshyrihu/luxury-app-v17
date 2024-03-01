import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IProfessionAddOrEditDto } from 'src/app/core/interfaces/IProfessionAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-professions',
  templateUrl: './addoredit-professions.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditProfessionsComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  submitting: boolean = false;

  id: number = 0;

  cb_area_responsable: ISelectItemDto[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    nameProfession: ['', [Validators.required, Validators.minLength(5)]],
    ecompanyDepartments: ['', [Validators.required]],
    description: ['', [Validators.required]],
    hierarchy: ['', [Validators.required]],
    requirements: ['', [Validators.required]],
    responsibilities: ['', [Validators.required]],
    professionkey: ['', [Validators.required]],
  });

  onLoadSelectItem() {
    this.cb_area_responsable = [
      { value: 0, label: 'Administrativa' },
      { value: 1, label: 'Legal' },
      { value: 2, label: 'Operaciones' },
      { value: 3, label: 'Mantenimiento' },
      { value: 4, label: 'Servicio' },
    ];
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  onLoadData(id: number) {
    this.dataService
      .get<IProfessionAddOrEditDto>(`Professions/${id}`)
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
      // ...Creación de registro
      this.dataService
        .post(`Professions`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      // ...Actualización de registro
      this.dataService
        .put(`Professions/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
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
