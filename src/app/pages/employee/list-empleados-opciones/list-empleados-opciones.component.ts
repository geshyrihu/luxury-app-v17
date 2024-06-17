// import { Component, OnInit, inject } from '@angular/core';
// import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { ApiRequestService } from 'src/app/core/services/api-request.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { CustomerIdService } from 'src/app/core/services/customer-id.service';
// import UpdatePasswordModalComponent from 'src/app/pages/application-user/modal-edit-account/update-password-modal/update-password-modal.component';
// import AddoreditPersonDataComponent from 'src/app/pages/person/addoredit-person-data/addoredit-person-data.component';
// import ListPersonEmergencyContactComponent from 'src/app/pages/person/list-person-emergency-contact/list-person-emergency-contact.component';
// import PersonAddoreditAddressComponent from 'src/app/pages/person/person-addoredit-address/person-addoredit-address.component';
// import PersonEditDataLaboralComponent from 'src/app/pages/person/person-edit-data-laboral/person-edit-data-laboral.component';
// import PersonEditDataPrincipalComponent from 'src/app/pages/person/person-edit-data-principal/person-edit-data-principal.component';
// import SolicitudAltaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-alta/solicitud-alta.component';
// import SolicitudBajaComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-baja/solicitud-baja.component';
// import SolicitudModificacionSalarioComponent from 'src/app/pages/reclutamiento/solicitudes/solicitud-modificacion-salario/solicitud-modificacion-salario.component';

// import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
// import Swal from 'sweetalert2';
// import PersonUpdatePhotoComponent from '../../person/person-update-photo/update-image-person.component';
// import AccountToEmployeeComponent from '../account-to-employee/account-to-employee.component';

// @Component({
//   selector: 'app-list-empleados-opciones',
//   templateUrl: './list-empleados-opciones.component.html',
//   standalone: true,
//   imports: [LuxuryAppComponentsModule],
// })
// export default class ListEmpleadosOpcionesComponent implements OnInit {
//   apiRequestService = inject(ApiRequestService);
//   dialogHandlerService = inject(DialogHandlerService);
//   authService = inject(AuthService);
//   config = inject(DynamicDialogConfig);
//   customerIdService = inject(CustomerIdService);

//   tienePermiso: boolean = true;
//   ngOnInit(): void {
//     // Validamos si el usuario authentiucado es admin o asistente
//     if (
//       this.authService.infoEmployeeDto.professionId == 5 ||
//       this.authService.infoEmployeeDto.professionId == 57 ||
//       this.authService.infoEmployeeDto.professionId == 58 ||
//       this.authService.infoEmployeeDto.professionId == 6
//     ) {
//       this.onValidarAdminAsis();
//     }
//     this.onValidarProfession();
//     this.onValidarSolicitudesAbiertas();
//   }

//   ref: DynamicDialogRef;

//   applicationUserId: string = this.config.data.applicationUserId;
//   personId: string = this.config.data.personId;
//   employeeId: number = this.config.data.employeeId;
//   active: boolean = this.config.data.active;

//   solicitudBajaStatus: any;
//   solicitudAltaStatus: any;
//   accionPermitida: boolean = false;
//   solicitudModificacionSalarioStatus: any;
//   workPosition: any;

//   // comparar la profession del usuario que ha iniciado sesion, con la profession del empleado a editar,
//   // si es usuario es asistente o administrador no podria editar empleados que son asistentes o administradores
//   onValidarAdminAsis() {
//     // ProfessionId Administrador= 5, Asistente = 6
//     this.apiRequestService
//       .onGetItem(`employees/validaradminasis/${this.employeeId}`)
//       .then((result: any) => {
//         this.tienePermiso = result;
//       });
//   }

//   // Datos Principales
//   onShowModalDatosPrincipales() {
//     this.dialogHandlerService.openDialog(
//       PersonEditDataPrincipalComponent,
//       {
//         applicationUserId: this.applicationUserId,
//       },
//       'Datos Principales',
//       this.dialogHandlerService.dialogSizeFull
//     );
//   }
//   // Datos Personales
//   onShowModalDatosPersonales() {
//     this.dialogHandlerService.openDialog(
//       AddoreditPersonDataComponent,
//       {
//         applicationUserId: this.applicationUserId,
//       },
//       'Datos Personales',
//       this.dialogHandlerService.dialogSizeFull
//     );
//   }
//   // Datos Laborales
//   onShowModalDatosLaboral() {
//     this.dialogHandlerService.openDialog(
//       PersonEditDataLaboralComponent,
//       {
//         employeeId: this.employeeId,
//         applicationUserId: this.applicationUserId,
//       },
//       'Datos laborales',
//       this.dialogHandlerService.dialogSizeFull
//     );
//   }

//   // Modal datos direccion
//   onModalDataAddress() {
//     this.dialogHandlerService.openDialog(
//       PersonAddoreditAddressComponent,
//       {
//         applicationUserId: this.applicationUserId,
//       },
//       'Dirección',
//       this.dialogHandlerService.dialogSizeFull
//     );
//   }
//   onShowModalEmergencyContact() {
//     this.dialogHandlerService.openDialog(
//       ListPersonEmergencyContactComponent,
//       {
//         applicationUserId: this.applicationUserId,
//       },
//       'Contactos de Emergencia',
//       this.dialogHandlerService.dialogSizeFull
//     );
//   }

//   onShowModalActualizarImagen() {
//     this.dialogHandlerService.openDialog(
//       PersonUpdatePhotoComponent,
//       {
//         applicationUserId: this.applicationUserId,
//       },
//       'Actualizar Foto',
//       this.dialogHandlerService.dialogSizeMd
//     );
//   }

//   onModalUpdatePassword() {
//     this.dialogHandlerService.openDialog(
//       UpdatePasswordModalComponent,
//       {
//         applicationUserId: this.applicationUserId,
//       },
//       'Cambio de contraseña',
//       this.dialogHandlerService.dialogSizeMd
//     );
//   }
//   onModalAccountToEmployee() {
//     this.dialogHandlerService.openDialog(
//       AccountToEmployeeComponent,
//       {
//         personId: this.personId,
//         applicationUserId: this.applicationUserId,
//       },
//       'Asignar cuenta de usuario',
//       this.dialogHandlerService.dialogSizeLg
//     );
//   }

//   // Solicitud de alta

//   onModalSolicitudALta() {
//     this.dialogHandlerService
//       .openDialog(
//         SolicitudAltaComponent,
//         {
//           employeeId: this.employeeId,
//           customerId: this.customerIdService.customerId,
//         },
//         'Solicitud de alta',
//         this.dialogHandlerService.dialogSizeFull
//       )
//       .then((result: boolean) => {
//         if (result) this.onValidarSolicitudesAbiertas();
//       });
//   }
//   onDelete() {
//     Swal.fire({
//       title: '¿Vas elimnar este registro?',
//       text: 'confirmar',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#34c38f',
//       cancelButtonColor: '#f46a6a',
//       confirmButtonText: 'Sí!',
//       cancelButtonText: 'Cancelar!',
//     }).then((result) => {
//       if (result.value) {
//         this.apiRequestService
//           .onDelete(`Employees/${this.employeeId}`)
//           .then(() => {});
//       }
//     });
//   }

//   onBlockEmployee() {
//     Swal.fire({
//       title: this.active ? 'Desactivar este Empleado' : 'Activar este Empleado',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#34c38f',
//       cancelButtonColor: '#f46a6a',
//       confirmButtonText: 'Sí!',
//       cancelButtonText: 'Cancelar!',
//     }).then((result) => {
//       if (result.value) {
//         this.apiRequestService
//           .onGetItem(`Employees/Bloqueo/${this.employeeId}`)
//           .then(() => {
//             this.active = !this.active;
//           });
//       }
//     });
//   }

//   // Metodo para solicitar baja del empleado

//   onModalSolicitudBaja() {
//     this.dialogHandlerService
//       .openDialog(
//         SolicitudBajaComponent,
//         {
//           employeeId: this.employeeId,
//         },
//         'Solicitud de baja',
//         this.dialogHandlerService.dialogSizeFull
//       )
//       .then((result: boolean) => {
//         if (result) this.onValidarSolicitudesAbiertas();
//       });
//   }

//   //Solicitar Modificacion de salario

//   onModalSolicitudModificacionSalarion() {
//     this.dialogHandlerService
//       .openDialog(
//         SolicitudModificacionSalarioComponent,
//         {
//           workPositionId: this.employeeId,
//         },
//         'Solicitud de Modificación de salario',
//         this.dialogHandlerService.dialogSizeFull
//       )
//       .then((result: boolean) => {
//         if (result) this.onValidarSolicitudesAbiertas();
//       });
//   }

//   // Metodo para validar si hay solicitudes abiertas
//   // Solicitud de baja
//   // Solicitud de modificacion de salario
//   onValidarSolicitudesAbiertas() {
//     const urlApi = `employees/validarsolicitudesabiertas/${this.employeeId}`;
//     this.apiRequestService.onGetItem(urlApi).then((result: any) => {
//       this.workPosition = result.workPosition;
//       this.solicitudAltaStatus = result.solicitudAlta;
//       this.solicitudBajaStatus = result.solicitudBaja;
//       this.solicitudModificacionSalarioStatus =
//         result.solicitudModificacionSalario;
//     });
//   }

//   // Validar si el usuario tiene una profesion asignada valida para solicitar estas acciones
//   onValidarProfession() {
//     const urlApi = `employees/validarprofession/${this.employeeId}`;
//     this.apiRequestService.onGetItem(urlApi).then((result: any) => {
//       this.accionPermitida = result;
//     });
//   }
// }
