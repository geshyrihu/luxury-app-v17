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
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { TicketGroupService } from '../../ticket.service';

@Component({
    selector: 'app-ticket-message-close',
    templateUrl: './ticket-message-close.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class TicketMessageCloseComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  ticketGroupService = inject(TicketGroupService);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = this.config.data.id;
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    closedDate: ['', Validators.required],
    closedById: ['', Validators.required],
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
    beforeWorkPreview: [null], // Vista previa de BeforeWork
    afterWorkPreview: [null], // Vista previa de AfterWork
    customerId: [this.customerIdS.customerId],
  });

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `Tickets/GetByClosed/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
      this.form.patchValue({
        closedById: this.authS.applicationUserId,
      });
      // Si las imágenes existen, carga las vistas previas
      // Si las imágenes existen, establece las vistas previas con la URL completa
      if (responseData.beforeWorkPreview) {
        this.form
          .get('beforeWorkPreview')
          ?.setValue(responseData.beforeWorkPreview);
      }

      if (responseData.afterWorkPreview) {
        this.form
          .get('afterWorkPreview')
          ?.setValue(responseData.afterWorkPreview);
      }
    });
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

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;
      const formData = new FormData();

      this.form.patchValue({
        customerId: this.customerIdS.customerId,
        closedDate: new Date(this.form.value.closedDate).toISOString(),
      });

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
      this.apiRequestS
        .onPut(`Tickets/Closed/${this.id}`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
