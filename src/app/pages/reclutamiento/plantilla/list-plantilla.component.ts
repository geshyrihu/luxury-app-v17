import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import CardEmployeeComponent from 'src/app/pages/directorios/employee-internal/card-employee.component';
import DescripcionPuestoComponent from 'src/app/pages/settings/catalogos/professions/descripcion-puesto.component';
import SolicitudVacanteComponent from '../solicitudes/solicitud-vacante.component';
import AddoreditPlantillaComponent from './addoredit-plantilla.component';
import HoursWorkPositionComponent from './hours-work-position.component';

@Component({
    selector: 'app-list-plantilla',
    templateUrl: './list-plantilla.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListWorkPlantillaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  router = inject(Router);
  authS = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dialogS = inject(DialogService);
  messageS = inject(MessageService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  data: any[] = [];
  ref: DynamicDialogRef;

  state = 0;
  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `workposition/getall/${this.customerIdS.getCustomerId()}/${
      this.state
    }`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  //Modal para visualizar horarios de la vacante
  onModalHoursWorkPosition(workPositionId: number) {
    this.ref = this.dialogS.open(HoursWorkPositionComponent, {
      data: {
        workPositionId,
      },
      header: 'Horario de trabajo',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onLoadData();
      }
    });
  }
  //Modal para cambio de contraseña

  //Modal para visualizar descripcion de puesto
  onModalJobDescription(id: number) {
    this.ref = this.dialogS.open(DescripcionPuestoComponent, {
      data: {
        id,
      },
      header: 'Descripción del puesto',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onLoadData();
      }
    });
  }

  //Solicitar vacante
  onModalSolicitudVacante(id: number) {
    this.ref = this.dialogS.open(SolicitudVacanteComponent, {
      data: {
        workPositionId: id,
      },
      header: 'Solicitud de vacante',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onLoadData();
      }
    });
  }
  //Ver tarjeta de Colaborador
  onCardEmployee(applicationUserId: string) {
    this.ref = this.dialogS.open(CardEmployeeComponent, {
      data: {
        applicationUserId,
      },
      header: 'Tarjeta de Colaborador',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  //Solicitud vigente de modificacion de salario
  onRouteEstatusSalaryModification(employeeId: number, workPositionId: number) {
    this.statusSolicitudVacanteService.setemployeeId(employeeId);
    this.statusSolicitudVacanteService.setworkPositionId(workPositionId);
    this.router.navigate([
      '/reclutamiento/status-solicitud-modificacion-salario/',
    ]);
  }
  //Solicitud vigente de modificacion de baja
  onRouteEstatusRequestDismissal(workPositionId: number) {
    this.statusSolicitudVacanteService.setworkPositionId(workPositionId);
    this.router.navigate(['/reclutamiento/status-solicitud-baja']);
  }

  /*Se valida si pa profesion de Adminisrtador o Asistente entonces no puede ver las opciones a
  menos que sea Supervisor */
  onValidateRole(professionId: number): boolean {
    let validation = true;
    if (professionId === 5 || professionId === 6) {
      validation = this.authS.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
      ]);
    }
    return validation;
  }
  //Editar vacante
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogS.open(AddoreditPlantillaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onLoadData();
      }
    });
  }
  //Eliminar vacante workPosition
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`WorkPosition/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onValidateShowTIcket(professionId: number): boolean {
    let permission = true;
    if (professionId == 5) {
      permission = this.authS.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
      ]);
    }
    if (professionId == 6) {
      permission = this.authS.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
        'Administrador',
      ]);
    }
    return permission;
  }

  onSelectActive(active: boolean): any {
    if (active) {
      this.state = 0;
    }
    if (!active) {
      this.state = 1;
    }
    this.onLoadData();
  }

  ngGetAuthEdit(): boolean {
    return this.authS.onValidateRoles([
      'Asistente',
      'Administrador',
      'SuperUsuario',
    ]);
  }

  // Metodo para validar si el cliente es luxury, nada mas puede ver la info reclutamiento,
  // superusuario, si son vacantes de admincapacitacion las puede ver supervision si no no

  // customerId grupo shemeshs 1
  // ProfessionId Administrador capacitacion 54
  /**
   * Verifica si un cliente tiene acceso basado en su ID y profesión.
   * @param professionId El ID de la profesión del cliente.
   * @returns True si el cliente tiene acceso, False en caso contrario.
   */
  onValidateCustomerId(professionId: number): boolean {
    let acceso = true;

    // Validamos si el cliente tiene el ID 1
    if (this.customerIdS.customerId == 1) {
      // Si la profesión es 54, el cliente tiene acceso.
      if (professionId == 54) {
        return true;
      } else {
        // Si no es profesión 54, verificamos si el usuario tiene el rol 'SuperUsuario'.
        if (this.authS.onValidateRoles(['SuperUsuario'])) {
          return true;
        } else {
          // Si no tiene el rol 'SuperUsuario', el acceso se deniega.
          return false;
        }
      }
    }

    // Si el cliente no tiene el ID 1, se mantiene el acceso como verdadero.
    return acceso;
  }
}
