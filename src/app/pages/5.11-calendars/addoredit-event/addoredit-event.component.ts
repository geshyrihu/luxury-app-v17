import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-event',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './addoredit-event.component.html',
})
export default class AddoreditEventComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdService = inject(CustomerIdService);

  customerId = this.customerIdService.getCustomerId();
  calendarId: string = '';
  eventId: string = '';
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    isAllDay: [false],
    location: ['', [Validators.maxLength(200)]],
    isRecurring: [false],
    recurringPattern: ['', [Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.calendarId = this.config.data.calendarId;
    this.eventId = this.config.data.eventId;

    if (this.eventId !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `Calendars/events/${this.eventId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.eventId === '') {
      this.apiRequestService
        .onPost(
          `Calendars/${this.calendarId}/${this.customerId}/events`,
          this.form.value
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(
          `Calendars/events/${this.eventId}/${this.customerId}`,
          this.form.value
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  titleOption = [
    { label: 'Junta de comité presencial', value: 'JCM-PRE' },
    { label: 'Junta de comité virtual', value: 'JCM-VIR' },
    { label: 'Asamblea presencial', value: 'ASAM-VIR' },
    { label: 'Asamblea virtual', value: 'ASAM-PRE' },
    { label: 'Junta interna', value: 'JLUX' },
    { label: 'JINT', value: 'Junta con proveedores' },
  ];
}
