import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/destinatarios-mail-reporte.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-enviar-mail-reporte-semanal',
  templateUrl: './enviar-mail-reporte-semanal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EnviarMailReporteSemanalComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);
  messageService = inject(MessageService);
  ref = inject(DynamicDialogRef);

  year: number;
  numeroSemana: number;
  destinatarios: any[] = [];
  destinatariosFinal: IDestinatariosMailReporte[] = [];
  destinatariosAdicionales: IDestinatariosMailReporte[] = [];

  para: string = '';
  cc: string = '';
  cco: string = '';
  mostrarPara: boolean = false;
  mostrarCo: boolean = false;
  mostrarCco: boolean = false;
  placeholder: string = '';
  form: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        Validators.required,
      ],
    ],
  });

  ngOnInit(): void {
    this.numeroSemana = this.config.data.numeroSemana;
    this.year = this.config.data.year;
    this.onLoadSelectItem();
  }

  get f() {
    return this.form.controls;
  }
  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(
        `ResidentesEdificio/${this.customerIdService.getCustomerId()}`
      )
      .then((response: any) => {
        this.destinatarios = response;
      });
  }

  onEnviarEmail() {
    const urlApi = `SendEmail/ReporteSemanal/${
      this.authS.applicationUserId
    }/${this.customerIdService.getCustomerId()}/${this.year}/${
      this.numeroSemana
    }`;
    this.apiRequestService
      .onPost(urlApi, this.onFilterDestinatarios())
      .then((result: boolean) => {});
  }
  onSelectAll() {
    this.destinatarios.forEach((resp) => {
      resp.select = true;
    });
  }
  onDeselecteAll() {
    this.destinatarios.forEach((resp) => {
      resp.select = false;
    });
  }

  onFilterDestinatarios(): IDestinatariosMailReporte[] {
    this.destinatariosFinal = [];
    this.destinatarios.forEach((resp) => {
      let correo: IDestinatariosMailReporte;
      if (resp.select !== undefined && resp.email !== null) {
        if (resp.select) {
          const correoFiltro = {
            nivelPrivacidad: resp.nivelPrivacidad,
            emailResidente: resp.email,
          };

          correo = resp.email;
          this.destinatariosFinal.push(correoFiltro);
        }
      }
    });

    this.destinatariosAdicionales.forEach((resp) => {
      this.destinatariosFinal.push(resp);
    });
    return this.destinatariosFinal;
  }

  onAddCorreo() {
    let nivelPrivacidad: string = '';
    if (this.mostrarPara) nivelPrivacidad = 'PARA';
    if (this.mostrarCo) nivelPrivacidad = 'CC';
    if (this.mostrarCco) nivelPrivacidad = 'CCO';
    const correoFiltro = {
      nivelPrivacidad: nivelPrivacidad,
      emailResidente: this.form.get('email').value,
    };
    this.form.patchValue({
      email: '',
    });
    this.destinatariosAdicionales.push(correoFiltro);
  }

  onMostrarInput(
    para: boolean,
    cc: boolean,
    cco: boolean,
    placeholder: string
  ) {
    this.mostrarPara = para;
    this.mostrarCo = cc;
    this.mostrarCco = cco;
    this.placeholder = `${placeholder}  (separar correos con ";")`;
  }

  onDeleteDestinatariosAdicionales(indexArr: any) {
    this.destinatariosAdicionales.splice(indexArr, 1);
  }
}
