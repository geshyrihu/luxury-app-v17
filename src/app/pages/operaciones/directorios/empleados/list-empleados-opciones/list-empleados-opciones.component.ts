import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import UpdatePasswordModalComponent from 'src/app/pages/configuracion/accounts/modal-edit-account/update-password-modal/update-password-modal.component';
import AddoreditPersonDataComponent from 'src/app/pages/person/addoredit-person-data/addoredit-person-data.component';
import ListPersonEmergencyContactComponent from 'src/app/pages/person/list-person-emergency-contact/list-person-emergency-contact.component';
import PersonAddoreditAddressComponent from 'src/app/pages/person/person-addoredit-address/person-addoredit-address.component';
import PersonEditDataLaboralComponent from 'src/app/pages/person/person-edit-data-laboral/person-edit-data-laboral.component';
import PersonEditDataPrincipalComponent from 'src/app/pages/person/person-edit-data-principal/person-edit-data-principal.component';
import SolicitudAltaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-alta/solicitud-alta.component';
import SolicitudBajaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-baja/solicitud-baja.component';
import SolicitudModificacionSalarioComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-modificacion-salario/solicitud-modificacion-salario.component';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import Swal from 'sweetalert2';
import PersonUpdatePhotoComponent from '../../../../person/person-update-photo/update-image-person.component';
import AccountToEmployeeComponent from '../account-to-employee/account-to-employee.component';
import AddOrEditEmplopyeeComponent from '../addoredit-data-employee/addoredit-employee.component';

@Component({
  selector: 'app-list-empleados-opciones',
  templateUrl: './list-empleados-opciones.component.html',
  standalone: true,
  imports: [ComponentsModule, NgbTooltip, PrimeNgModule, CommonModule],
  providers: [CustomToastService, MessageService],
})
export default class ListEmpleadosOpcionesComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private dialogService = inject(DialogService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  tienePermiso: boolean = true;
  ngOnInit(): void {
    // Validamos si el usuario authentiucado es admin o asistente
    if (
      this.authService.infoEmployeeDto.professionId == 5 ||
      this.authService.infoEmployeeDto.professionId == 57 ||
      this.authService.infoEmployeeDto.professionId == 58 ||
      this.authService.infoEmployeeDto.professionId == 6
    ) {
      console.log(
        '🚀 ~ Si es administrador o asistente ',
        this.authService.infoEmployeeDto.professionId
      );
      this.onValidarAdminAsis();
    }
    console.log('🚀 ~ tienePermiso:', this.tienePermiso);
    this.onValidarProfession();
    this.onValidarSolicitudesAbiertas();
  }

  ref: DynamicDialogRef;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  applicationUserId: string = this.config.data.applicationUserId;
  personId: string = this.config.data.personId;
  employeeId: number = this.config.data.employeeId;
  active: boolean = this.config.data.active;

  solicitudBajaStatus: any;
  solicitudAltaStatus: any;
  accionPermitida: boolean = false;
  solicitudModificacionSalarioStatus: any;
  workPosition: any;

  // comparar la profession del usuario que ha iniciado sesion, con la profession del empleado a editar,
  // si es usuario es asistente o administrador no podria editar empleados que son asistentes o administradores
  onValidarAdminAsis() {
    // ProfessionId Administrador= 5, Asistente = 6

    this.dataService
      .get(`employees/validaradminasis/${this.employeeId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.tienePermiso = resp.body;

          if (!this.tienePermiso) {
            console.log(
              'No tiene permiso para editar este empleado',
              this.tienePermiso
            );
          } else {
            console.log(
              'Si tiene permiso para editar este empleado',
              this.tienePermiso
            );
          }
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  // Datos Principales
  onShowModalDatosPrincipales() {
    this.ref = this.dialogService.open(PersonEditDataPrincipalComponent, {
      data: {
        personId: this.personId,
      },
      header: 'Datos Principales',
      styleClass: 'modal-w-100',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
      }
    });
  }
  // Datos Personales
  onShowModalDatosPersonales() {
    this.ref = this.dialogService.open(AddoreditPersonDataComponent, {
      data: {
        personId: this.personId,
      },
      header: 'Datos Personales',
      styleClass: 'modal-w-100',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
      }
    });
  }
  // Datos Laborales
  onShowModalDatosLaboral() {
    this.ref = this.dialogService.open(PersonEditDataLaboralComponent, {
      data: {
        employeeId: this.employeeId,
        personId: this.personId,
      },
      header: 'Datos laborales',
      styleClass: 'modal-w-100',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
      }
    });
  }

  // Modal datos direccion
  onModalDataAddress() {
    this.ref = this.dialogService.open(PersonAddoreditAddressComponent, {
      data: {
        personId: this.personId,
      },
      header: 'Dirección',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        if (resp) {
          this.customToastService.onShowSuccess();
        }
      }
    });
  }
  onShowModalEmergencyContact() {
    this.ref = this.dialogService.open(ListPersonEmergencyContactComponent, {
      data: {
        personId: this.personId,
      },
      header: 'Contactos de Emergencia',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
      }
    });
  }

  onShowModalActualizarImagen() {
    this.ref = this.dialogService.open(PersonUpdatePhotoComponent, {
      data: {
        personId: this.personId,
      },
      header: 'Actualizar Foto',
      baseZIndex: 10000,
      closeOnEscape: true,
      styleClass: 'modal-md',
    });

    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
      }
    });
  }

  onModalUpdatePassword() {
    this.ref = this.dialogService.open(UpdatePasswordModalComponent, {
      data: {
        applicationUserId: this.applicationUserId,
      },
      header: 'Cambio de contraseña',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onModalAccountToEmployee() {
    this.ref = this.dialogService.open(AccountToEmployeeComponent, {
      data: {
        personId: this.personId,
        applicationUserId: this.applicationUserId,
      },
      header: 'Asignar cuenta de usuario',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }

  // Solicitud de alta

  onModalSolicitudALta() {
    this.ref = this.dialogService.open(SolicitudAltaComponent, {
      data: {
        employeeId: this.employeeId,
        customerId: this.customerIdService.customerId,
      },
      header: 'Solicitud de alta',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onValidarSolicitudesAbiertas();
      }
    });
  }
  onDelete() {
    Swal.fire({
      title: '¿Vas elimnar este registro?',
      text: 'confirmar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí!',
      cancelButtonText: 'Cancelar!',
    }).then((result) => {
      if (result.value) {
        // Mostrar un mensaje de carga
        this.customToastService.onLoading();
        this.dataService
          .delete(`Employees/${this.employeeId}`)
          .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
          .subscribe({
            next: () => {
              this.customToastService.onCloseToSuccess();
            },
            error: (err) => {
              // En caso de error, mostrar un mensaje de error y registrar el error en la consola
              this.customToastService.onCloseToError();
              console.log(err.error);
            },
          });
      }
    });
  }

  onBlockEmployee() {
    Swal.fire({
      title: this.active ? 'Desactivar este Empleado' : 'Activar este Empleado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí!',
      cancelButtonText: 'Cancelar!',
    }).then((result) => {
      if (result.value) {
        this.dataService
          .get(`Employees/Bloqueo/${this.employeeId}`)
          .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
          .subscribe({
            next: () => {
              this.customToastService.onCloseToSuccess();
              this.active = !this.active;
            },
            error: (err) => {
              // En caso de error, mostrar un mensaje de error y registrar el error en la consola
              this.customToastService.onCloseToError();
              console.log(err.error);
            },
          });
      }
    });
  }

  onShowModalAddOrEdit() {
    this.ref = this.dialogService.open(AddOrEditEmplopyeeComponent, {
      data: {
        id: this.employeeId,
        // tipoContrato: this.tipoContrato,
      },
      header: 'Actualizar datos',
      width: '100%',
      height: 'auto',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.customToastService.onShowSuccess();
    });
  }

  // Metodo para solicitar baja del empleado

  onModalSolicitudBaja() {
    this.ref = this.dialogService.open(SolicitudBajaComponent, {
      data: {
        employeeId: this.employeeId,
      },
      header: 'Solicitud de baja',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onValidarSolicitudesAbiertas();
      }
    });
  }

  //Solicitar Modificacion de salario

  onModalSolicitudModificacionSalarion() {
    this.ref = this.dialogService.open(SolicitudModificacionSalarioComponent, {
      data: {
        workPositionId: this.employeeId,
      },
      header: 'Solicitud de Modificación de salario',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onValidarSolicitudesAbiertas();
      }
    });
  }

  // Metodo para validar si hay solicitudes abiertas
  // Solicitud de baja
  // Solicitud de modificacion de salario
  onValidarSolicitudesAbiertas() {
    this.dataService
      .get(`employees/validarsolicitudesabiertas/${this.employeeId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.workPosition = resp.body.workPosition;
          this.solicitudAltaStatus = resp.body.solicitudAlta;
          this.solicitudBajaStatus = resp.body.solicitudBaja;
          this.solicitudModificacionSalarioStatus =
            resp.body.solicitudModificacionSalario;
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  // Validar si el usuario tiene una profesion asignada valida para solicitar estas acciones
  onValidarProfession() {
    this.dataService
      .get(`employees/validarprofession/${this.employeeId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.accionPermitida = resp.body;
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
