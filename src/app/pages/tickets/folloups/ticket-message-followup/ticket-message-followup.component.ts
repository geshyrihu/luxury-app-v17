import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-ticket-message-followup',
    templateUrl: './ticket-message-followup.component.html',
    imports: [LuxuryAppComponentsModule],
    providers: []
})
export default class TicketMessageFollowupComponent
  implements OnInit, OnDestroy
{
  apiRequestS = inject(ApiRequestService);

  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  description: any[] = [];
  submitting: boolean = false;

  loading = false;
  seguimientoLenght: number = 200;
  seguimientoConst: string = '';
  ticketMessageId: number = this.config.data.id;
  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    ticketMessageId: [this.ticketMessageId, Validators.required],
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
    this.loading = true;

    const urlApi = `TicketMessageFollowUp/List/${this.ticketMessageId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.description = responseData;
      this.loading = false;
    });
  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestS
      .onPost(`TicketMessageFollowUp`, this.form.value)
      .then((_) => {
        this.onCargaListaseguimientos();
        this.form.patchValue({
          description: '',
        });
        this.seguimientoLenght = 200;
      });
  }
  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
