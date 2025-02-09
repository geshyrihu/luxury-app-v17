import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-view',
  templateUrl: './ticket-message-view.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class TicketMessageViewComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  notificationPushService = inject(SignalRService);
  ticketGroupService = inject(TicketGroupService);
  route = inject(ActivatedRoute);
  enumSelectService = inject(EnumSelectService);

  id: string = '';
  ticketGroupId: string = '';
  submitting: boolean = false;

  cb_priority = [];
  cb_ticket_group: ISelectItem[] = [];
  cb_user: any[] = [];

  form: FormGroup = this.formBuilder.group({
    id: new FormControl(
      { value: this.id, disabled: true },
      Validators.required
    ),
    ticketGroupId: [this.ticketGroupId, Validators.required], // Título
    title: ['', [Validators.required, Validators.maxLength(100)]], // Título
    description: ['', [Validators.required, Validators.maxLength(150)]], // Descripción
    priority: [1, Validators.required], // Prioridad (enum)
    creatorId: [this.authS.applicationUserId], // Id del creador
    customerId: [this.custIdService.customerId], // Id del cliente
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
    beforeWorkPreview: [null], // Vista previa de BeforeWork
    afterWorkPreview: [null], // Vista previa de AfterWork
    applicationUserId: [this.authS.applicationUserId],
    assignee: [''], // El campo 'assignee' será obligatorio si hay fecha de cierre
    assigneeId: [null],
    scheduledDate: [null],
    closedDate: [null],
  });

  applicationUserId: string = this.authS.applicationUserId;
  notificationUserId: string = '';
  async ngOnInit() {
    this.cb_priority = await this.enumSelectService.priorityLevel();
    // Obtener el ticketId de los parámetros de la ruta
    this.route.params.subscribe((params) => {
      this.id = params['ticketMessageId'];
      this.ticketGroupId = params['ticketGroupId'];

      this.form.patchValue({
        ticketGroupId: this.ticketGroupId,
      });
      this.notificationUserId = params['notificationUserId'];
      if (this.id !== '') this.onLoadData();
      this.onLoadUsers();
      this.onLoadTicketGroup();
      this.UpdateToRead();
    });
  }

  UpdateToRead() {
    const urlApi = `NotificationUser/UpdateToRead/${this.applicationUserId}/${this.notificationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.notificationPushService.emitNotificationUpdate();
    });
  }
  onLoadTicketGroup() {
    const urlApi = `TicketGroupList/${this.custIdService.getCustomerId()}`;
    this.apiRequestService.onGetSelectItem(urlApi).then((result: any) => {
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
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
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
    // Validar si la fecha de cierre es menor que la fecha de programación
    const scheduledDate = this.form.get('scheduledDate')?.value;
    const closedDate = this.form.get('closedDate')?.value;

    if (
      closedDate &&
      scheduledDate &&
      new Date(closedDate) < new Date(scheduledDate)
    ) {
      alert(
        'La fecha de cierre no puede ser menor que la fecha de programación.'
      );
      return; // Detiene la ejecución si la validación falla
    }

    // Validar si existe fecha de cierre y no hay usuario asignado
    if (closedDate && !this.form.get('assigneeId')?.value) {
      alert('Si hay una fecha de cierre, debe asignarse un usuario.');
      return; // Detiene la ejecución si la validación falla
    }

    if (this.form.valid) {
      this.submitting = true;

      const formData = new FormData();

      const rawValues = this.form.getRawValue();
      Object.keys(rawValues).forEach((key) => {
        const value = rawValues[key];

        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file: File) => {
            if (file) {
              formData.append('Images', file, file.name);
            }
          });
        } else if (key === 'beforeWork' || key === 'afterWork') {
          const file = value as File;
          if (file && file instanceof File) {
            formData.append(key, file, file.name);
          } else {
            formData.append(key, '');
          }
        } else if (key === 'scheduledDate' || key === 'closedDate') {
          const dateValue = value;
          if (dateValue) {
            const formattedDate = new Date(dateValue)
              .toISOString()
              .split('T')[0];
            formData.append(key, formattedDate);
          } else {
            formData.append(key, '');
          }
        } else {
          formData.append(key, value != null ? value : '');
        }
      });

      if (this.id !== '') {
        this.apiRequestService
          .onPut(`Tickets/Update/${this.id}`, formData)
          .then((result: any) => {
            if (result.beforeWorkPreview) {
              this.form
                .get('beforeWorkPreview')
                ?.setValue(result.beforeWorkPreview);
            }

            if (result.afterWorkPreview) {
              this.form
                .get('afterWorkPreview')
                ?.setValue(result.afterWorkPreview);
            }
            this.form.patchValue({
              applicationUserId: this.authS.applicationUserId,
            });
            this.submitting = false;
            this.onLoadUsers();
            this.onLoadTicketGroup();
          });
      }
    }
  }

  onLoadUsers() {
    const urlApi = `Tickets/Participant/${this.ticketGroupId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_user = result;
    });
  }

  public saveUserId(e: any): void {
    let find = this.cb_user.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      assigneeId: find?.value,
    });
  }
}
