import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IWorkPositionDto } from 'src/app/core/interfaces/IEmpresaOrganigramaDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  StatusSolicitudVacanteService,
} from 'src/app/core/services/common-services';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import DescripcionPuestoComponent from '../../professions/descripcion-puesto.component';
import SolicitudVacanteComponent from '../../solicitudes/solicitud-vacante/solicitud-vacante.component';
import AddoreditPlantillaComponent from '../addoredit-plantilla.component';
import EmployeeToWorkPositionComponent from '../employee-to-work-position/employee-to-work-position.component';
import HoursWorkPositionComponent from '../hours-work-position.component';

@Component({
  selector: 'app-list-plantilla',
  templateUrl: './list-plantilla.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    RouterModule,
    PrimeNgModule,
  ],
  providers: [
    ConfirmationService,
    DialogService,
    MessageService,
    CustomToastService,
  ],
})
export default class ListWorkPlantillaComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  pahtBaseImg = environment.base_urlImg + 'Administration/accounts/';
  ref: DynamicDialogRef;
  subRef$: Subscription;
  state = 0;
  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IWorkPositionDto[]>(
        'WorkPosition/GetAll/' +
          this.customerIdService.getcustomerId() +
          '/' +
          this.state
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  //Modal para visualizar horarios de la vacante
  onModalHoursWorkPosition(workPositionId: number) {
    this.ref = this.dialogService.open(HoursWorkPositionComponent, {
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Modal para cambio de contraseña

  //Modal para visualizar descripcion de puesto
  onModalJobDescription(id: number) {
    this.ref = this.dialogService.open(DescripcionPuestoComponent, {
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //Solicitar vacante
  onModalSolicitudVacante(id: number) {
    this.ref = this.dialogService.open(SolicitudVacanteComponent, {
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  // Solicitar baja
  // Editar empleado
  onModalAddEmployeeToWorkPosition(id: number) {
    this.ref = this.dialogService.open(EmployeeToWorkPositionComponent, {
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  // Editar empleado

  // TODO: Eliminar al impelnentar directo al empleado
  // onModalSolicitudBaja(id: number) {
  //   this.ref = this.dialogService.open(SolicitudBajaComponent, {
  //     data: {
  //       workPositionId: id,
  //     },
  //     header: 'Solicitud de baja',
  //     width: '100%',
  //     height: '100%',
  //     closeOnEscape: true,
  //     baseZIndex: 10000,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }

  //Solicitar Modificacion de salario

  // onModalSolicitudModificacionSalarion(id: number) {
  //   this.ref = this.dialogService.open(SolicitudModificacionSalarioComponent, {
  //     data: {
  //       workPositionId: id,
  //     },
  //     header: 'Solicitud de Modificación de salario',
  //     width: '100%',
  //     height: '100%',
  //     closeOnEscape: true,
  //     baseZIndex: 10000,
  //   });
  //   this.ref.onClose.subscribe((resp: boolean) => {
  //     if (resp) {
  //       this.customToastService.onShowSuccess();
  //       this.onLoadData();
  //     }
  //   });
  // }

  //Ver tarjeta de Colaborador
  onCardEmployee(employeeId: any) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId: employeeId,
      },
      header: 'Tarjeta de Colaborador',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  //Navegar a la solicitud pendiente con sus candidatos
  onRouteEstatusSolicitud(positionRequestId: number) {
    this.statusSolicitudVacanteService.setPositionRequestId(positionRequestId);
    this.router.navigate(['/reclutamiento/status-solicitud-vacante']);
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
      validation = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
      ]);
    }
    return validation;
  }
  //Editar vacante
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditPlantillaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Eliminar vacante workPosition
  onDelete(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`WorkPosition/${id}`).subscribe({
      next: () => {
        this.customToastService.onCloseToSuccess();
        this.onLoadData();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }
  SendMailTest() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get('SolicitudesReclutamiento/SendMailTest')
      .subscribe({
        next: (_) => {
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  onValidateShowTIcket(professionId: number): boolean {
    let permission = true;
    if (professionId == 5) {
      permission = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
      ]);
    }
    if (professionId == 6) {
      permission = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
        'Residente',
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
    return this.authService.onValidateRoles([
      'Asistente',
      'Residente',
      'SuperUsuario',
    ]);
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
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
    if (this.customerIdService.customerId == 1) {
      // Si la profesión es 54, el cliente tiene acceso.
      if (professionId == 54) {
        return true;
      } else {
        // Si no es profesión 54, verificamos si el usuario tiene el rol 'SuperUsuario'.
        if (this.authService.onValidateRoles(['SuperUsuario'])) {
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
