import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EPriorityLevel } from 'src/app/core/enums/priority-level.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { LuxuryChatService } from '../luxury-chat.service';
@Component({
  selector: 'app-luxury-chat-message-add-or-edit',
  templateUrl: './luxury-chat-message-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
})
export default class LuxuryChatMessageAddOrEditComponent implements OnInit {
  customerIdService = inject(CustomerIdService);
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  luxuryChatService = inject(LuxuryChatService);

  id: string = '';
  submitting: boolean = false;

  cb_priority = onGetSelectItemFromEnum(EPriorityLevel);

  urlImage = this.luxuryChatService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );

  form: FormGroup = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    luxuryChatGroupId: [
      this.config.data.luxuryChatGroupId,
      Validators.required,
    ], // LuxuryChatGroupId
    title: ['', [Validators.required, Validators.maxLength(100)]], // Título
    description: ['', [Validators.required, Validators.maxLength(150)]], // Descripción
    priority: [1, Validators.required], // Prioridad (enum)
    creatorId: [this.authService.applicationUserId], // Id del creador
    customerId: [this.customerIdService.customerId], // Id del cliente
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
    beforeWorkPreview: [null], // Vista previa de BeforeWork
    afterWorkPreview: [null], // Vista previa de AfterWork
  });

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  // Para manejar las imágenes 'BeforeWork' y 'AfterWork'
  onFileChange(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(fieldName)?.setValue(file);

      // Crear una vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get(fieldName + 'Preview')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onLoadData() {
    const urlApi = `LuxuryChatMessage/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      // Si las imágenes existen, carga las vistas previas
      // Si las imágenes existen, establece las vistas previas con la URL completa
      if (result.beforeWorkPreview) {
        const beforeWorkUrl = `${this.urlImage}/${result.beforeWorkPreview}`;
        this.form.get('beforeWorkPreview')?.setValue(beforeWorkUrl);
      }

      if (result.afterWorkPreview) {
        const afterWorkUrl = `${this.urlImage}/${result.afterWorkPreview}`;
        this.form.get('afterWorkPreview')?.setValue(afterWorkUrl);
      }
    });
  }
  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;
      const formData = new FormData();

      // Agrega todos los controles del formulario a FormData
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);

        // Verifica si el control es un array (en este caso, para las imágenes) o si es un archivo individual
        if (key === 'images' && control instanceof FormArray) {
          // Si es un FormArray (como el de imágenes adicionales), agrega cada archivo
          control.controls.forEach((fileControl: FormControl) => {
            const file = fileControl.value as File;
            if (file) {
              formData.append('Images', file, file.name);
            }
          });
        } else if (key === 'beforeWork' || key === 'afterWork') {
          // Si es una de las imágenes de trabajo antes/después, agrégala por separado
          const file = control?.value as File;
          if (file) {
            formData.append(key, file, file.name);
          }
        } else {
          // Para todos los demás controles, agrega los valores como texto (excepto archivos)
          formData.append(key, control?.value);
        }
      });
      if (this.id === '') {
        this.apiRequestService
          .onPost(`LuxuryChatMessage/Create`, formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : (this.submitting = false);
          });
      } else {
        this.apiRequestService
          .onPut(`LuxuryChatMessage/Update/${this.id}`, formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : (this.submitting = false);
          });
      }
    }
  }
}
