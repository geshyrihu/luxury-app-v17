import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputDateComponent from 'src/app/custom-components/custom-input-form/custom-input-date/custom-input-date.component';

@Component({
  selector: 'app-ticket-traking',
  templateUrl: './ticket-traking.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputDateComponent],
})
export default class TicketTrakingComponent implements OnInit, OnDestroy {
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);

  seguimientos: any[] = [];
  submitting: boolean = false;

  loading = false;
  seguimientoLenght: number = 200;
  seguimientoConst: string = '';
  ticketId: string = this.config.data.ticketId;
  id: string = '';

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    ticketId: [this.ticketId, Validators.required],
    dateCreation: [this.dateS.getDateNow(), Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
    description: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ],
    ],
  });
  ngOnInit() {
    flatpickrFactory();
    this.onCargaListaseguimientos();
  }

  validarCaracteres(value: any) {
    this.seguimientoLenght = 200;
    this.seguimientoLenght = this.seguimientoLenght - value.value.length;

    if (this.seguimientoConst.length > 200) {
      const valor = this.seguimientoConst.substring(0, 199);
      this.form.patchValue({
        description: valor,
      });
    }
  }

  onCargaListaseguimientos() {
    this.apiRequestS
      .onGetItem(`TicketLegal/Traking/${this.ticketId}`)
      .then((result: any) => {
        this.seguimientos = result;
      });
  }
  get f() {
    return this.form.controls;
  }

  onCreateItem = false;
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestS
      .onPost(`TicketLegal/Addtraking`, this.form.value)
      .then(() => {
        this.onCargaListaseguimientos();
        this.form.patchValue({
          description: '',
        });
        this.onCreateItem = true;
        this.seguimientoLenght = 200;
        this.submitting = false;
      });
  }

  ngOnDestroy(): void {
    if (this.onCreateItem) {
      this.ref.close(true);
    }
  }
}
