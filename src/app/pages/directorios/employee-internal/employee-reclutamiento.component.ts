import { Component, Input, OnInit, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import SolicitudAltaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-alta.component';
import SolicitudBajaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-baja.component';
import SolicitudModificacionSalarioComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-modificacion-salario.component';

@Component({
  selector: 'employee-reclutamiento',
  templateUrl: './employee-reclutamiento.component.html',
  standalone: true,
})
export default class EmployeeReclutamientoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);

  @Input() employeeId: any;

  solicitudAltaStatus: any;
  solicitudBajaStatus: any;
  solicitudModificacionSalarioStatus: any;

  workPosition: any;

  ngOnInit() {
    this.onValidarSolicitudesAbiertas();
  }

  // Metodo para validar si hay solicitudes abiertas
  // Solicitud de baja
  // Solicitud de modificacion de salario
  onValidarSolicitudesAbiertas() {
    const urlApi = `employees/validarsolicitudesabiertas/${this.employeeId}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.workPosition = result.workPosition;
      this.solicitudAltaStatus = result.solicitudAlta;
      this.solicitudBajaStatus = result.solicitudBaja;
      this.solicitudModificacionSalarioStatus =
        result.solicitudModificacionSalario;
    });
  }

  onModalSolicitudALta() {
    this.dialogHandlerS
      .openDialog(
        SolicitudAltaComponent,
        {
          employeeId: this.employeeId,
          customerId: this.customerIdS.customerId,
        },
        'Solicitud de alta',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) {
          this.onValidarSolicitudesAbiertas();
        }
      });
  }

  // Metodo para solicitar baja del empleado

  onModalSolicitudBaja() {
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaComponent,
        {
          employeeId: this.employeeId,
        },
        'Solicitud de baja',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onValidarSolicitudesAbiertas();
      });
  }

  //Solicitar Modificacion de salario

  onModalSolicitudModificacionSalarion() {
    this.dialogHandlerS
      .openDialog(
        SolicitudModificacionSalarioComponent,
        {
          workPositionId: this.employeeId,
        },
        'Solicitud de Modificación de salario',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onValidarSolicitudesAbiertas();
      });
  }
}
