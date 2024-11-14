import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

import { LuxuryAppService } from 'src/app/core/services/luxury-app.service';
@Component({
  selector: 'app-ticket-message-followup',
  templateUrl: './ticket-message-followup.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [LuxuryAppService],
})
export default class TicketMessageFollowupComponent
  implements OnInit, OnDestroy
{
  appService = inject(LuxuryAppService);

  description: any[] = [];
  submitting: boolean = false;

  loading = false;
  seguimientoLenght: number = 200;
  seguimientoConst: string = '';
  ticketMessageId: number = this.appService.config.data.id;
  id: number = 0;

  form: FormGroup = this.appService.formBuilder.group({
    id: { value: this.id, disabled: true },
    ticketMessageId: [this.ticketMessageId, Validators.required],
    applicationUserId: [
      this.appService.authS.applicationUserId,
      Validators.required,
    ],
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
    this.appService.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.description = result;
      this.loading = false;
    });
  }
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (!this.appService.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    this.appService.apiRequestService
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
    this.appService.ref.close(true);
  }
}
