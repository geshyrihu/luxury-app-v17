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
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import UpdatePasswordModalComponent from 'src/app/pages/configuracion/accounts/modal-edit-account/update-password-modal/update-password-modal.component';
import SolicitudBajaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-baja/solicitud-baja.component';
import SolicitudModificacionSalarioComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-modificacion-salario/solicitud-modificacion-salario.component';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import Swal from 'sweetalert2';
import AccountToEmployeeComponent from '../account-to-employee/account-to-employee.component';
import AddOrEditEmployeeOnlyImgComponent from '../addoredit-employee-img.component';
import AddOrEditEmplopyeeComponent from '../addoredit-employee.component';
import ContactEmployeeComponent from '../contact-employee.component';

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
  ngOnInit(): void {
    this.onValidarSolicitudesAbiertas();
  }
  private dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  private dataService = inject(DataService);

  ref: DynamicDialogRef;
  // subRef$: Subscription;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  applicationUserId: string = this.config.data.applicationUserId;
  employeeId: number = this.config.data.employeeId;
  active: boolean = this.config.data.active;

  solicitudBajaStatus: any;
  solicitudModificacionSalarioStatus: any;
  workPosition: any;

  onShowModalcontactEmployee() {
    this.ref = this.dialogService.open(ContactEmployeeComponent, {
      data: {
        id: this.employeeId,
      },
      header: 'Contactos de Emergencia',
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

  onShowModalActualizarImagen() {
    this.ref = this.dialogService.open(AddOrEditEmployeeOnlyImgComponent, {
      data: {
        applicationUserId: this.employeeId,
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
      data: { id: this.employeeId, applicationUserId: this.applicationUserId },
      header: 'Asignar cuenta de usuario',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
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
        workPositionId: this.employeeId,
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

  ngOnDestroy() {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
