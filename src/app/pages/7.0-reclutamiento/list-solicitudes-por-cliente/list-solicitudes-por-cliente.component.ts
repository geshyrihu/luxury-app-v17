import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import AddOrEditSolicitudAltaComponent from '../list-solicitudes/list-solicitud-alta/addoredit-solicitud-alta/addoredit-solicitud-alta.component';
import AddoreditSolicitudBajaComponent from '../list-solicitudes/list-solicitud-baja/addoredit-solicitud-baja/addoredit-solicitud-baja.component';
import AddoreditModificacionSalarioComponent from '../list-solicitudes/list-solicitud-modificación-sueldo/addoredit-modificacion-salario/addoredit-modificacion-salario.component';
import AddOrEditVacanteComponent from '../list-solicitudes/list-solicitud-vacantes/addoredit-vacante.component';

@Component({
  selector: 'app-list-solicitudes-por-cliente',
  templateUrl: './list-solicitudes-por-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListSolicitudesPorClienteComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  router = inject(Router);
  authS = inject(AuthService);

  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  // Si es administrador vamos a evitar que traiga todas las solicitudes que sean de administrador y asisntente

  onLoadData() {
    const urlApi =
      'SolicitudesReclutamiento/solicitudesporcliente/' +
      this.custIdService.getCustomerId() +
      '/' +
      this.authS.infoUserAuthDto.applicationUserId;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onRouteEstatusSolicitud(id) {
    this.statusSolicitudVacanteService.setPositionRequestId(id);
    this.router.navigate(['/reclutamiento/status-solicitud-vacante']);
  }
  onModalEditVacante(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditVacanteComponent,
        {
          id: data.id,
        },
        'Editar Registro',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditSolicitudAlta(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditSolicitudAltaComponent,
        {
          id: data.id,
        },
        'Editar Registro',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditSolicitudBaja(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditSolicitudBajaComponent,
        {
          id: data.id,
        },
        'Editar Registro',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditModificacionSalario(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditModificacionSalarioComponent,
        {
          id: data.id,
        },
        'Editar Registro',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
