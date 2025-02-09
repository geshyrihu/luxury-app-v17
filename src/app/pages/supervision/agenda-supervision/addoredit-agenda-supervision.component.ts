import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-agenda-supervision',
  templateUrl: './addoredit-agenda-supervision.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditAgendaSupervisionComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);

  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dateService = inject(DateService);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: number = 0;

  cb_customer: any[] = [];
  rangeDates: Date[];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    fechaSolicitud: [this.dateService.getDateNow(), Validators.required],
    customerId: [
      this.authS.userTokenDto.infoUserAuthDto.customerId,
      Validators.required,
    ],
    problema: ['', Validators.required],
    solucion: [''],
    fechaConclusion: [],
    applicationUserId: [this.authS.applicationUserId],
  });

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`customers`)
      .then((response: any) => {
        this.cb_customer = response;
      });
  }

  ngOnInit(): void {
    flatpickrFactory();
    this.id = this.config.data.id;
    this.onLoadSelectItem();
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `AgendaSupervision/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      result.fechaConclusion = this.dateService.getDateFormat(
        result.fechaConclusion
      );
      result.fechaSolicitud = this.dateService.getDateFormat(
        result.fechaSolicitud
      );
      this.form.patchValue(result);
    });
  }

  submit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`AgendaSupervision`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`AgendaSupervision/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
