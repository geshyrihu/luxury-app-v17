import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataConnectorService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-addoredit-presentacion-junta-comite',
  templateUrl: './addoredit-presentacion-junta-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AddoreditPresentacionJuntaComiteComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dataService = inject(DataConnectorService);
  ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;
  id: number = 0;
  filePath: string = '';
  errorMessage: string = '';

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    archivo: [''],
    area: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form.patchValue({ area: this.config.data.titulo });
  }

  change(file: any) {
    this.form.patchValue({ archivo: file });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);

    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .post(`PresentacionJuntaComite/AddFile`, model)
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

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('applicationUserId', this.authS.applicationUserId);
    formData.append('area', String(dto.area));
    if (dto.archivo) {
      formData.append('archivo', dto.archivo);
    }
    return formData;
  }
}
