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
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { TicketGroupService } from '../../ticket.service';
@Component({
  selector: 'app-my-ticket-message-add',
  templateUrl: './my-ticket-message-add.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
})
export default class MyTicketMessageAddComponent implements OnInit {
  customerIdService = inject(CustomerIdService);
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  ticketGroupService = inject(TicketGroupService);
  notificationService = inject(NotificationService); // Inyectamos el NotificationService

  id: string = '';
  submitting: boolean = false;

  cb_priority = onGetSelectItemFromEnum(EPriorityLevel);
  cb_ticket_group: ISelectItem[] = [];
  urlImage = this.ticketGroupService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );

  form: FormGroup = this.formBuilder.group({
    id: new FormControl({ value: '', disabled: true }, Validators.required),
    ticketGroupId: ['', Validators.required], // ticketGroupId
    title: ['', [Validators.required, Validators.maxLength(100)]], // Título
    description: ['', [Validators.required, Validators.maxLength(150)]], // Descripción
    priority: [1, Validators.required], // Prioridad (enum)
    creatorId: [this.authService.applicationUserId], // Id del creador
    customerId: [this.customerIdService.customerId], // Id del cliente
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
  });

  ngOnInit() {
    this.onLoadTicketGrupp();
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
  onLoadTicketGrupp() {
    const urlApi = `TicketGroup/SelectItem/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.cb_ticket_group = result;
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
      this.apiRequestService
        .onPost(`TicketMessage/Create`, formData)
        .then((result: boolean) => {
          if (result) {
            this.ref.close(true);
            this.notificationService.notifyUpdate(); // Notificamos que se realizó una actualización
          } else {
            this.submitting = false;
          }
        });
    }
  }
}
