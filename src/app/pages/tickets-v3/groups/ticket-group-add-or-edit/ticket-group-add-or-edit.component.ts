import { CommonModule } from '@angular/common';
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
import { NotificationService } from 'src/app/core/services/notification.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-ticket-group-add-or-edit',
  templateUrl: './ticket-group-add-or-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, CommonModule],
})
export default class TicketGroupAddOrEditComponent implements OnInit {
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  notificationService = inject(NotificationService); // Inyectamos el NotificationService

  id: string = this.config.data.id;
  submitting: boolean = false;

  cb_isPublic = [
    { label: 'Publico', value: true },
    { label: 'Privado', value: false },
  ];
  cb_ticketGroupCategory: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: new FormControl({ value: this.id, disabled: true }), // Deshabilitado desde el inicio
    customerId: new FormControl(
      this.customerIdService.customerId,
      Validators.required
    ),
    isPublic: [false, Validators.required],
    ticketGroupCategoryId: new FormControl('', Validators.required),
    userCreateId: [this.authService.applicationUserId, Validators.required],
  });

  ngOnInit(): void {
    this.onLoadTicketGroupCategory();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `ticketGroup/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onLoadTicketGroupCategory() {
    const urlApi = `ticketGroupCategory/selectItem/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_ticketGroupCategory = result;
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`ticketGroup`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`ticketGroup/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
