import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-minuta-detalle',
  templateUrl: './addoredit-minuta-detalle.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditMinutaDetalleComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
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
  cb_area: ISelectItem[] = onGetSelectItemFromEnum(EAreaMinutasDetalles);
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    responsibleAreaId: [1, Validators.required],
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

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MeetingsDetails/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
      const contenidoHTML = this.form.get('requestService').value;
      const contenidoSinHTML = contenidoHTML.replace(/<[^>]*>|&nbsp;/g, '');
      this.form.get('requestService').patchValue(contenidoSinHTML);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`MeetingsDetails`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`MeetingsDetails/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
