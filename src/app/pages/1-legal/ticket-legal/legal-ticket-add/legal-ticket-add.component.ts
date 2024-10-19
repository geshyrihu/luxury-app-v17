import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ISelectItem } from './../../../../core/interfaces/select-Item.interface';

import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-legal-ticket-add-or-edit',
  templateUrl: './legal-ticket-add.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, FlatpickrModule],
})
export default class LegalTicketAddComponent implements OnInit {
  customerIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  auhtService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  cb_legal_matter: ISelectItem[] = [];
  constructor() {
    flatpickrFactory();
  }
  id: string = '';
  list: ISelectItem[] = [];
  submitting: boolean = false;
  tipoSolicitud = 1;

  typeServiceMonitor: number = 0;
  cb_type_Service: ISelectItem[] = [
    {
      value: 0,
      label: 'DESPACHO EXTERNO',
    },
    {
      value: 1,
      label: 'LEGAL INTERNO',
    },
  ];

  cb_customer: ISelectItem[] = [];
  // professionId = this.auhtService.infoEmployeeDto.professionId;
  employee: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: ['', Validators.required],
    typeService: [0, Validators.required],
    ApplicationUserRequestId: [this.auhtService.applicationUserId],
    title: [null, Validators.required],
    fechaAsamblea: [],
    fechaJunta: [],
    horaJunta: [],
    provider: [],
    request: [],
    condomino: [],
    documentCloud: [false],
    documentEmail: [false],
    tipoSolicitud: [this.tipoSolicitud],
  });
  ngOnInit() {
    this.onLegalMatter();
    this.apiRequestService.onGetSelectItem(`NombreCorto`).then((resp: any) => {
      this.cb_customer = resp;
    });
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.apiRequestService
      .onGetItem(`TicketLegal/EmployeeLegal`)
      .then((result: any) => {
        this.employee = result;
      });
  }
  onLegalMatter() {
    const urlApi = `LegalMatter/Select`;

    this.apiRequestService.onGetList(urlApi).then((result: ISelectItem[]) => {
      this.cb_legal_matter = result;
    });
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`TicketLegal/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.tipoSolicitud = result.tipoSolicitud;
      });
  }
  onSubmit() {
    this.form.removeControl('typeService');

    console.log('form....', this.form.value);

    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    this.submitting = true;

    this.apiRequestService
      .onPost(`TicketLegal`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onChangeTitle(data: ESolicitudLegalInterno | ESolicitudLegalExterno) {
    let numeroEnum: string | undefined;

    // Verifica si el dato pertenece al enum ESolicitudLegalInterno
    if (data in ESolicitudLegalInterno) {
      numeroEnum = ESolicitudLegalInterno[data];
    }
    // Verifica si el dato pertenece al enum ESolicitudLegalExterno
    else if (data in ESolicitudLegalExterno) {
      numeroEnum = ESolicitudLegalExterno[data];
    }

    // Si se encontró un número enum válido, actualiza el estado
    if (numeroEnum !== undefined) {
      this.tipoSolicitud = Number(numeroEnum);
      this.form.patchValue({ tipoSolicitud: numeroEnum });
    } else {
      console.warn('El dato proporcionado no corresponde a un enum válido.');
    }
  }

  onChangeTitlea(data: ESolicitudLegalInterno | ESolicitudLegalExterno) {
    const numeroEnum = ESolicitudLegalInterno[data]; // Accede al valor numérico asociado al enum
    this.tipoSolicitud = Number(numeroEnum);
    this.form.patchValue({ tipoSolicitud: numeroEnum });
  }

  onTypeServiceMonitorChange(value: any): void {
    this.typeServiceMonitor = value;

    // Determina el enum según el valor y llama a la función una vez
    this.list = onGetSelectItemFromEnum(
      value === 0 ? ESolicitudLegalExterno : ESolicitudLegalInterno
    );
  }
  saveLegalMatter(e: any): void {
    console.log('🚀 ~ event.target.value:', e.target.value);
    this.form.patchValue({ title: e.target.value });
    console.log('🚀 ~ this.form:', this.form.value);
  }
}

export enum ESolicitudLegalInterno {
  '1. ATENCION DE ASAMBLEA' = 1,
  '2. ATENCION DE AUDIENCIA DE CONCILIACION' = 2,
  '3. AUDITORIAS' = 3,
  '4. AVISO DE TERMINACION A PROVEEDOR' = 4,
  '5. AVISO DE TERMINACION A RESIDENCIAL' = 5,
  '6. BAJA DE COLABORADOR' = 6,
  '7. CAPACITACION DEL AREA LEGAL' = 7,
  '8. CARTAS PODER' = 8,
  '9. CONSULTA DE ACUERDO EN PROTOCOLIZACION DE ACTA DE ASAMBLEA' = 9,
  '10. CONSULTA DE PODERES LEGALES VIGENTES' = 10,
  '11. CONSULTA DE REGLAMENTO INTERNO' = 11,
  '12. CONVENIO DE CONFIDENCIALIDAD' = 12,
  '13. COTIZACION DE PROTOCOLIZACION DE ASAMBLEA Y HONORARIOS' = 13,
  '14. ENTREGA DE ADMINISTRACION' = 14,
  '15. FIRMA DE DOCUMENTOS' = 15,
  '16. FORMATOS LEGALES' = 16,
  '17. OTRA CONSULTA' = 17,
  '18. PODERES O REVOCACIONES NOTARIALES' = 18,
  '19. PROPUESTA COMERCIAL Y LICITACION' = 19,
  '20. PROTOCOLIZACION DE ACTAS DE ASAMBLEA' = 20,
  '21. RECEPCION DE ADMINISTRACION' = 21,
  '22. SOLICITUD DE DOCUMENTOS' = 22,
}

export enum ESolicitudLegalExterno {
  '1. ACTAS DE ASAMBLEA' = 1,
  '2. AVISO DE PRIVACIDAD' = 2,
  '3. CONVENIO DE MOROSO' = 3,
  '4. CONVOCATORIAS DE ASAMBLEA' = 4,
  '5. CONSULTA DE COBRANZA JUDICIAL O EXTRAJUDICIAL' = 5,
  '6. COTIZACION DE SERVICIO COBRANZA JUDICIAL/EXTRAJUDICIAL' = 6,
  '7. ELABORACIÓN DE REQUERIMIENTO' = 7,
  '8. JUNTA CON PROVEEDOR' = 8,
  '9. JUNTA DE COMITÉ' = 9,
  '10. MAILS A COMITÉ' = 10,
  '11. MINUTAS DE ACUERDOS DE ASAMBLEA' = 11,
  '12. RESPUESTA A REQUERIMIENTOS' = 12,
  '13. REVISION DE CONTRATOS' = 13,
  '14. REVISION O MODIFICACION DE REGLAMENTO' = 14,
  '15. FUNDAMENTOS LEGALES PARA ASUNTO' = 15,
  '16. PROBLEMÁTICA CON CONDÓMINO' = 16,
  '17. ELABORACION DE CONVENIO MODIFICATORIO' = 17,
}

// export enum ESolicitudLegal {
//   '1. ALTA DE PROVEEDOR' = 1,
//   '2. RENOVACION DE CONTRATO PROVEEDORES' = 2,
//   '3. ASAMBLEAS' = 3,
//   '4. JUNTAS DE COMITÉ, TEMAS LEGALES' = 4,
//   '5. CONVENIOS MOROSOS' = 5,
//   '6. LITIGIOS' = 6,
//   // '7. OTROS' = 7,
//   '8. OTROS' = 8,
// }
