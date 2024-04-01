import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addoredit-telefonos-emergencia',
  templateUrl: './addoredit-telefonos-emergencia.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditTelefonosEmergenciaComponent {
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: any = 0;
  urlBaseImg = '';
  model: any;
  photoFileUpdate: boolean = false;
  form: FormGroup;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      instancia: ['', Validators.required],
      telefonoUno: ['', Validators.required],
      telefonoDos: [''],
      direccion: [''],
      logo: [''],
    });
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ logo: file });
  }

  onLoadData() {
    this.dataService
      .get(`TelefonosEmergencia/${this.id}`)
      .subscribe((resp: any) => {
        this.urlBaseImg = `${environment.base_urlImg}Administration/tel-emergencia/${resp.body.logo}`;
        this.form.patchValue(resp.body);
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post('TelefonosEmergencia', formData)
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
        .put(`TelefonosEmergencia/${this.id}`, formData)
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

  private createFormData(dto: any): FormData {
    const formData = new FormData();
    formData.append('instancia', dto.instancia);
    formData.append('telefonoUno', dto.telefonoUno);
    formData.append('telefonoDos', dto.telefonoDos);
    formData.append('direccion', dto.direccion);
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.logo) {
      formData.append('logo', dto.logo);
    }
    return formData;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
