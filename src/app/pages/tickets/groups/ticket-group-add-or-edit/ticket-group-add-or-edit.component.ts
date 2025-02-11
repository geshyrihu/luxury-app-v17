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
import { NotificationService } from 'src/app/core/services/notification.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-ticket-group-add-or-edit',
    templateUrl: './ticket-group-add-or-edit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class TicketGroupAddOrEditComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  notificationS = inject(NotificationService); // Inyectamos el NotificationService
  enumSelectS = inject(EnumSelectService);

  id: string = this.config.data.id;
  submitting: boolean = false;

  cb_visibility: ISelectItem[] = [];
  cb_ticketGroupCategory: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }), // Deshabilitado desde el inicio
    customerId: new FormControl(
      this.customerIdS.customerId,
      Validators.required
    ),
    visibility: [null, Validators.required],
    ticketGroupCategoryId: new FormControl(null, Validators.required),
    userCreateId: [this.authS.applicationUserId, Validators.required],
  });

  async ngOnInit() {
    this.cb_visibility = await this.enumSelectS.visibilityLevel();
    this.onLoadTicketGroupCategory();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `ticketGroup/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }

  onLoadTicketGroupCategory() {
    const urlApi = `TicketGroupCategory/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetSelectItem(urlApi).then((responseData: any) => {
      this.cb_ticketGroupCategory = responseData;
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestS
        .onPost(`ticketGroup`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`ticketGroup/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
