import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';

import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SignalrCustomService } from 'src/app/core/services/signalrcustom.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-legal-ticket-add-or-edit',
  templateUrl: './legal-ticket-add.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule, FlatpickrModule],
})
export default class LegalTicketAddComponent implements OnInit {
  private customerIdService = inject(CustomerIdService);
  private formBuilder = inject(FormBuilder);
  private signalrCustomService = inject(SignalrCustomService);
  public apiRequestService = inject(ApiRequestService);
  public auhtService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  constructor() {
    flatpickrFactory();
  }
  id: string = '';
  list: ISelectItemDto[] = onGetSelectItemFromEnum(ESolicitudLegal);
  submitting: boolean = false;
  tipoSolicitud = 1;

  professionId = this.auhtService.infoEmployeeDto.professionId;
  employee: ISelectItemDto[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.customerId],
    requestPersonId: [this.auhtService.infoEmployeeDto.personId],
    title: ['1. ALTA DE PROVEEDOR'],
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
        this.signalrCustomService.hubConnection.on(
          'Nueva solicitud TicketLegal',
          (respuesta) => {
            console.log('Respuesta hubConnection: ', respuesta);
          }
        );
      });
  }

  onChangeTitle(data: ESolicitudLegal) {
    const numeroEnum = ESolicitudLegal[data]; // Accede al valor numérico asociado al enum
    this.tipoSolicitud = Number(numeroEnum);
    this.form.patchValue({ tipoSolicitud: numeroEnum });
  }
}

export enum ESolicitudLegal {
  '1. ALTA DE PROVEEDOR' = 1,
  '2. RENOVACION DE CONTRATO PROVEEDORES' = 2,
  '3. ASAMBLEAS' = 3,
  '4. JUNTAS DE COMITÉ, TEMAS LEGALES' = 4,
  '5. CONVENIOS MOROSOS' = 5,
  '6. LITIGIOS' = 6,
  // '7. OTROS' = 7,
  '8. OTROS' = 8,
}
