import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ITicketseguimiento } from 'src/app/core/interfaces/ticketseguimiento.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-ticket-seguimiento',
  templateUrl: './ticket-seguimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketSeguimientoComponent implements OnInit, OnDestroy {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);

  seguimientos: ITicketseguimiento[] = [];
  submitting: boolean = false;

  loading = false;
  seguimientoLenght: number = 200;
  seguimientoConst: string = '';
  weeklyReportId: number = this.config.data.id;
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    weeklyReportId: [this.weeklyReportId, Validators.required],
    applicationUserId: [this.authS.applicationUserId, Validators.required],
    seguimiento: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ],
    ],
  });
  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  validarCaracteres(value: any) {
    this.seguimientoLenght = 200;
    this.seguimientoLenght = this.seguimientoLenght - value.value.length;

    if (this.seguimientoConst.length > 200) {
      const valor = this.seguimientoConst.substring(0, 199);
      this.form.patchValue({
        seguimiento: valor,
      });
    }
  }

  onCargaListaseguimientos() {
    this.loading = true;

    const urlApi = `TicketSeguimiento/seguimientos/${this.weeklyReportId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.seguimientos = result;
      this.loading = false;
    });
  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestService
      .onPost(`TicketSeguimiento`, this.form.value)
      .then((_) => {
        this.onCargaListaseguimientos();
        this.form.patchValue({
          seguimiento: '',
        });
        this.seguimientoLenght = 200;
      });
  }
  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
