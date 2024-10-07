import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
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

  constructor() {
    flatpickrFactory();
  }
  id: string = '';
  list: ISelectItem[] = onGetSelectItemFromEnum(ESolicitudLegal);
  submitting: boolean = false;
  tipoSolicitud = 1;

  cb_customer: ISelectItem[] = [];
  // professionId = this.auhtService.infoEmployeeDto.professionId;
  employee: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [null, Validators.required],
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

  onLoadData() {
    this.apiRequestService
      .onGetItem(`TicketLegal/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.tipoSolicitud = result.tipoSolicitud;
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    this.submitting = true;

    this.apiRequestService
      .onPost(`TicketLegal`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onChangeTitle(data: ESolicitudLegal) {
    const numeroEnum = ESolicitudLegal[data]; // Accede al valor numérico asociado al enum
    this.tipoSolicitud = Number(numeroEnum);
    this.form.patchValue({ tipoSolicitud: numeroEnum });
  }
}

export enum ESolicitudLegal {
  '1. CONVENIOS DE CONFIDENCIALIDAD' = 1,
  '2. CONVOCATORIAS DE ASAMBLEA' = 2,
  '3. MINUTAS DE ACUERDOS DE ASAMBLEA' = 3,
  '4. ACTAS DE ASAMBLEA' = 4,
  '5. CONVENIOS DE MOROSOS' = 5,
  '6. REVISIÓN DE CONTRATOS' = 6,
  '7. REVISIÓN DE REGLAMENTOS' = 7,
  '8. JUNTAS DE COMITÉ' = 8,
  '9. JUNTAS CON PROVEEDORES' = 9,
  '10. ALTA DE PROVEEDORES' = 10,
  '11. OTROS' = 11,
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
