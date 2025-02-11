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
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-my-ticket-message-addedit',
  templateUrl: './my-ticket-message-addedit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class MyTicketMessageAddEditComponent implements OnInit {
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  ticketGroupService = inject(TicketGroupService);
  notificationPushService = inject(SignalRService);
  enumSelectS = inject(EnumSelectService);

  id: string = '';
  submitting: boolean = false;

  cb_priority: ISelectItem[] = [];
  cb_ticket_group: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: new FormControl(
      { value: this.id, disabled: true },
      Validators.required
    ),
    ticketGroupId: [this.config.data.ticketGroupId, Validators.required], // ticketGroupId
    title: ['', [Validators.required, Validators.maxLength(100)]], // Título
    description: ['', [Validators.required, Validators.maxLength(150)]], // Descripción
    priority: [1, Validators.required], // Prioridad (enum)
    creatorId: [this.authS.applicationUserId], // Id del creador
    customerId: [this.customerIdS.customerId], // Id del cliente
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
    beforeWorkPreview: [null], // Vista previa de BeforeWork
    afterWorkPreview: [null], // Vista previa de AfterWork
    applicationUserId: [this.authS.applicationUserId],
    assignee: [''],
    assigneeId: [null],
    scheduledDate: [null],
    closedDate: [null],
  });

  async ngOnInit() {
    this.cb_priority = await this.enumSelectS.priorityLevel();
    this.onLoadTicketGroup();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }

  onLoadTicketGroup() {
    const urlApi = `TicketGroupList/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetSelectItem(urlApi).then((result: any) => {
      this.cb_ticket_group = result;
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

  onLoadData() {
    const urlApi = `Tickets/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      // Si las imágenes existen, carga las vistas previas
      // Si las imágenes existen, establece las vistas previas con la URL completa
      if (result.beforeWorkPreview) {
        this.form.get('beforeWorkPreview')?.setValue(result.beforeWorkPreview);
      }

      if (result.afterWorkPreview) {
        this.form.get('afterWorkPreview')?.setValue(result.afterWorkPreview);
      }

      this.form.patchValue({
        applicationUserId: this.authS.applicationUserId,
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting = true;

      const formData = new FormData();

      // Agrega todos los controles del formulario a FormData
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);

        if (key === 'images' && control instanceof FormArray) {
          // Manejar el FormArray para las imágenes adicionales
          control.controls.forEach((fileControl: FormControl) => {
            const file = fileControl.value as File;
            if (file) {
              formData.append('Images', file, file.name);
            }
          });
        } else if (key === 'beforeWork' || key === 'afterWork') {
          // Manejar las imágenes de beforeWork y afterWork
          const file = control?.value as File;
          if (file) {
            formData.append(key, file, file.name);
          }
        } else if (key === 'scheduledDate' || key === 'closedDate') {
          // Manejar la fecha programada (ScheduledDate) y la fecha de cierre (ClosedDate)
          const dateValue = control?.value;
          if (dateValue) {
            const formattedDate = new Date(dateValue)
              .toISOString()
              .split('T')[0]; // Formato 'YYYY-MM-DD'
            formData.append(key, formattedDate);
          } else {
            formData.append(key, ''); // Si no hay valor, se envía como vacío
          }
        } else {
          // Verifica si el valor es null antes de agregarlo a FormData
          const value = control?.value === null ? '' : control?.value;
          formData.append(key, value);
        }
      });

      // Verifica si es creación o actualización
      if (this.id === '') {
        this.apiRequestS
          .onPost(`Tickets/Create`, formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : (this.submitting = false);
          });
      } else {
        this.apiRequestS
          .onPut(`Tickets/Update/${this.id}`, formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : (this.submitting = false);
          });
      }
    }
  }
}
