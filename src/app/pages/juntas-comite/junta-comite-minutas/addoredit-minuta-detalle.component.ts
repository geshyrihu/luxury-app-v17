import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EnumSelectService } from '../../../core/services/enum-select.service';

@Component({
    selector: 'app-addoredit-minuta-detalle',
    templateUrl: './addoredit-minuta-detalle.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class AddoreditMinutaDetalleComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);

  submitting: boolean = false;

  cb_estatus = [
    {
      value: 0,
      label: 'Pendiente',
    },
    {
      value: 1,
      label: 'Concluido',
    },
    {
      value: 2,
      label: 'No Autorizado',
    },
  ];
  cb_area: ISelectItem[] = [];
  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    deliveryDate: [, Validators.required],
    status: [0, Validators.required],
    eAreaMinutasDetalles: [
      this.config.data.areaResponsable,
      Validators.required,
    ],
    title: ['', Validators.required],
    requestService: ['', Validators.required],
    meetingId: [this.config.data.meetingId, Validators.required],
    applicationUserId: [this.authS.applicationUserId],
  });

  async ngOnInit() {
    this.cb_area = await this.enumSelectS.areaMinutasDetalles();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MeetingsDetails/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
      const contenidoHTML = this.form.get('requestService').value;
      const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
      this.form.get('requestService').patchValue(contenidoSinHTML);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`MeetingsDetails`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`MeetingsDetails/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
