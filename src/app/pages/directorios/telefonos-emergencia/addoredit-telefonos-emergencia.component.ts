import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-telefonos-emergencia',
    templateUrl: './addoredit-telefonos-emergencia.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class AddOrEditTelefonosEmergenciaComponent {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
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

    this.form = this.formB.group({
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
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.urlBaseImg = responseData.logo;
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost('TelefonosEmergencia', formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`TelefonosEmergencia/${this.id}`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
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
