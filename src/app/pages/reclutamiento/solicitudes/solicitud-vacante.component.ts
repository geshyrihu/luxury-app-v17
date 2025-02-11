import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-solicitud-vacante',
  templateUrl: './solicitud-vacante.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class SolicitudVacanteComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);
  enumSelectS = inject(EnumSelectService);

  workPositionId: number = this.config.data.workPositionId;

  data: any;
  submitting: boolean = false;

  id: number = 0;

  cb_turnoTrabajo: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
    id: [this.config.data.workPositionId],
    professionName: [, Validators.required],
    sueldo: ['', [Validators.required, Validators.minLength(4)]],
    sueldoBase: ['', [Validators.required, Validators.minLength(4)]],
    turnoTrabajo: [null, Validators.required],
    lunesEntrada: [''],
    lunesSalida: [''],
    martesEntrada: [''],
    martesSalida: [''],
    miercolesEntrada: [''],
    miercolesSalida: [''],
    juevesEntrada: [''],
    juevesSalida: [''],
    viernesEntrada: [''],
    viernesSalida: [''],
    sabadoEntrada: [''],
    sabadoSalida: [''],
    domingoEntrada: [''],
    domingoSalida: [''],
    additionalInformation: [''],
  });

  async ngOnInit() {
    this.cb_turnoTrabajo = await this.enumSelectS.turnoTrabajo();
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `WorkPosition/${this.workPositionId}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestS
      .onPost(
        `SolicitudesReclutamiento/SolicitudVacante/${this.authS.infoUserAuthDto.applicationUserId}`,
        this.form.value
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
