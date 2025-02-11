import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addor-edit-meeting-seguimiento',
  templateUrl: './addor-edit-meeting-seguimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddorEditMeetingSeguimientoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);

  submitting: boolean = false;

  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    meetingDetailsId: [this.config.data.meetingDetailsId, Validators.required],
    fecha: ['', Validators.required],
    seguimiento: ['', Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.idMeetingSeguimiento;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MeetingDertailsSeguimiento/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      result.fecha = this.dateS.getDateFormat(result.fecha);
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.idMeetingSeguimiento;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`MeetingDertailsSeguimiento`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`MeetingDertailsSeguimiento/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
