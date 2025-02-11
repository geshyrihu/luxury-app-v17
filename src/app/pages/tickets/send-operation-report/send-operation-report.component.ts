import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDestinatariosMailReporte } from 'src/app/core/interfaces/destinatarios-mail-reporte.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-send-operation-report',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './send-operation-report.component.html',
})
export default class SendOperationReportComponent {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  messageS = inject(MessageService);
  ref = inject(DynamicDialogRef);

  year: number = this.config.data.year;
  numeroSemana: number = this.config.data.numeroSemana;

  // isDisabled: boolean = true; // Controla si el botón debe estar deshabilitado
  // errorMessage: string = ''; // Mensaje de error

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
  form: FormGroup = this.formB.group({
    email: [
      '',
      [
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        Validators.required,
      ],
    ],
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
  }

  get f() {
    return this.form.controls;
  }
  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem(`ResidentesEdificio/${this.customerIdS.getCustomerId()}`)
      .then((response: any) => {
        this.destinatarios = response;
      });
  }

  onEnviarEmail() {
    const applicationUserId = this.authS.applicationUserId;
    const customerId = this.customerIdS.getCustomerId();
    const urlApi = `SendEmail/OperationReport/${applicationUserId}/${customerId}/${this.year}/${this.numeroSemana}`;
    this.apiRequestS
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
            email: resp.email,
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
      email: this.form.get('email').value,
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

  // handleWeekChange(event: Event): void {
  //   // Obtener el valor del input en formato 'YYYY-WXX'
  //   const weekValue = (event.target as HTMLInputElement).value; // '2024-W41'

  //   // Obtener el año y el número de semana
  //   // Verificar si weekValue tiene un valor
  //   if (weekValue) {
  //     this.year = parseInt(weekValue.split('-W')[0], 10);
  //     this.numeroSemana = parseInt(weekValue.split('-W')[1], 10);

  //     // Si el año y el número de semana son válidos, habilitar el botón
  //     if (this.year > 0 && this.numeroSemana > 0) {
  //       this.isDisabled = false;
  //       this.errorMessage = ''; // Limpiar el mensaje de error si todo es válido
  //     } else {
  //       this.isDisabled = true;
  //       this.errorMessage = 'Por favor, seleccione una semana válida.';
  //     }
  //   } else {
  //     // Si no se seleccionó una semana, deshabilitar el botón y mostrar el mensaje
  //     this.isDisabled = true;
  //     this.errorMessage = 'Por favor, seleccione una semana.';
  //   }
  // }
}
