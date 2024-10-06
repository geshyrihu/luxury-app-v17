import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import LoadingSpinnerComponent from 'src/app/custom-components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ticket-group-participant',
  templateUrl: './ticket-group-participant.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    LuxuryAppComponentsModule,
    CustomInputModule,
  ],
})
export default class TicketGroupParticipantComponent
  implements OnInit, OnDestroy
{
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  cb_existing_Participant: any = [];
  loading_existing_participant: boolean = false;
  cb_application_user: ISelectItem[] = [];

  id: string = '';
  submitting: boolean = false;

  cb_eLuxury_group_rol: ISelectItem[] = [
    { label: 'Participante', value: false },
    { label: 'Administrador', value: true },
  ];

  form = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    ticketGroupId: [this.config.data.id, Validators.required],
    applicationUserId: ['', Validators.required],
    applicationUser: ['', Validators.required],
    isAdmin: [false, Validators.required],
  });
  ngOnInit() {
    this.onLoadAppUsers();
    this.onLoadExistingParticipants();
  }

  onLoadAppUsers() {
    const urlApi = `TicketGroupParticipant/Participants/${this.customerIdService.getCustomerId()}/${
      this.config.data.id
    }`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.cb_application_user = result;
    });
  }

  onLoadExistingParticipants() {
    this.loading_existing_participant = true;
    const urlApi = `TicketGroupParticipant/ExistingParticipants/${this.config.data.id}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.loading_existing_participant = false;
      this.cb_existing_Participant = result;
    });
  }

  public onSelectUser(e: any): void {
    let find = this.cb_application_user.find(
      (x: any) => x?.label === e.target.value
    );
    this.form.patchValue({
      applicationUser: find?.label,
      applicationUserId: find?.value,
    });
  }
  onSubmit(): void {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`TicketGroupParticipant`, this.form.value)
        .then((result: boolean) => {
          this.onCleanForm();
        });
    } else {
      this.apiRequestService
        .onPut(`TicketGroupParticipant/${this.id}`, this.form.value)
        .then((result: boolean) => {
          this.onCleanForm();
        });
    }
  }

  onEditParticipant(item: any) {
    this.id = item.id;
    this.form.patchValue({
      id: item.id,
      ticketGroupId: item.ticketGroupId,
      applicationUserId: item.applicationUserId,
      applicationUser: item.applicationUser,
      isAdmin: item.isAdmin,
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`TicketGroupParticipant/${id}`)
      .then((result: boolean) => {
        if (result)
          this.cb_existing_Participant = this.cb_existing_Participant.filter(
            (item: any) => item.id !== id
          );
      });
  }

  onCleanForm() {
    this.id = '';
    this.form.reset();
    this.form.patchValue({
      ticketGroupId: this.config.data.id,
    });
    this.ngOnInit();
    this.submitting = false;
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
