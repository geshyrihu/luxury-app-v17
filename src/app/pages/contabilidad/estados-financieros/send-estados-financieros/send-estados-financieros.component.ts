import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/destinatarios-mail-reporte.interface';
import {
  ApiRequestService,
  AuthService,
  CustomerIdService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-send-estados-financieros',
  templateUrl: './send-estados-financieros.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SendEstadosFinancierosComponent {
  public customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);

  submitting: boolean = false;

  id: number = 0;

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
    this.id = this.config.data.id;
    this.onLoadSelectItem();
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetList(
        `EstadoFinanciero/propietarios/${this.customerIdService.getcustomerId()}`
      )
      .then((result: any) => {
        this.destinatarios = result;
      });
  }

  onEnviarEmail() {
    this.submitting = true;
    this.apiRequestService
      .onPost(
        `EstadoFinanciero/Send/${this.id}/${this.authService.infoEmployeeDto.personId}`,
        this.onFilterDestinatarios()
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
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
  get f() {
    return this.form.controls;
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
