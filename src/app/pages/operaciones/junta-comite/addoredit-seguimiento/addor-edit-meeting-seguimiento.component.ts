import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authService = inject(AuthService);

  submitting: boolean = false;

  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    meetingDetailsId: [this.config.data.meetingDetailsId, Validators.required],
    fecha: ['', Validators.required],
    seguimiento: ['', Validators.required],
    personId: [this.authService.personId, Validators.required],
    applicationUserId: [
      this.authService.applicationUserId,
      Validators.required,
    ],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.idMeetingSeguimiento;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MeetingDertailsSeguimiento/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      result.fecha = this.dateService.getDateFormat(result.fecha);
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.idMeetingSeguimiento;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`MeetingDertailsSeguimiento`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`MeetingDertailsSeguimiento/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
