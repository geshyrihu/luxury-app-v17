import { Component, inject, OnInit } from '@angular/core';
import {
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
    selector: 'app-ticket-message-add-or-edit',
    templateUrl: './ticket-message-add-or-edit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class TicketMessageAddOrEditComponent implements OnInit {
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
  cb_user: any[] = [];

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
    this.onLoadUsers();
    this.onLoadTicketGroup();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }

  onLoadTicketGroup() {
    const urlApi = `TicketGroupList/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetSelectItem(urlApi).then((responseData: any) => {
      this.cb_ticket_group = responseData;
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
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
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
      this.form.patchValue({
        applicationUserId: this.authS.applicationUserId,
      });
    });
  }

  onSubmit(): void {
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

      // Verifica si es creación o actualización
      if (this.id === '') {
        this.apiRequestS
          .onPost(`Tickets/Create`, formData)
          .then((responseData: any) => {
            this.ref.close(responseData);
            this.submitting = false;
          });
      } else {
        this.apiRequestS
          .onPut(`Tickets/Update/${this.id}`, formData)
          .then((responseData: any) => {
            this.ref.close(responseData.value);
            this.submitting = false;
          });
      }
    }
  }

  onLoadUsers() {
    const urlApi = `Tickets/Participant/${this.config.data.ticketGroupId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_user = responseData;
    });
  }

  public saveUserId(e: any): void {
    let find = this.cb_user.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      assigneeId: find?.value,
    });
  }
}
