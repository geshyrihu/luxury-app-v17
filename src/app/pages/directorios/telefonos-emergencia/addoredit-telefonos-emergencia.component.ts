import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-telefonos-emergencia',
  templateUrl: './addoredit-telefonos-emergencia.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditTelefonosEmergenciaComponent {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

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
    const urlApi = `TelefonosEmergencia/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.urlBaseImg = result.logo;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost('TelefonosEmergencia', formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`TelefonosEmergencia/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
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
}
