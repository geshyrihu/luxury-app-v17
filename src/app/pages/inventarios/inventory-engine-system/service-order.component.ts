// import { Component, OnInit, inject } from '@angular/core';
// import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
// import { ConfirmationService } from 'primeng/api';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { ApiRequestService } from 'src/app/core/services/api-request.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { CustomToastService } from 'src/app/core/services/custom-toast.service';
// import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
// import AddoreditMaintenancePreventiveComponent from 'src/app/pages/calendar/mantenimiento-preventivo/addoredit-maintenance-preventive.component';

// //TODO: VALIDAR SU AUN ESTA ACTIVO ESTE MODULO
// @Component({
//   selector: 'app-service-order',
//   templateUrl: './service-order.component.html',
//   standalone: true,
//   imports: [LuxuryAppComponentsModule],
// })
// export default class ServiceOrderComponent implements OnInit {
//   apiRequestS = inject(ApiRequestService);
//   customToastService = inject(CustomToastService);
//    dialogHandlerS = inject(DialogHandlerService);

//   authS = inject(AuthService);
//   config = inject(DynamicDialogConfig);
//   ref = inject(DynamicDialogRef);
//   public confirmationService = inject(ConfirmationService);

//   maintenanceCalendars: any[] = [];
//   idMachinery: number = 0;

//   public editorConfig = {
//     readOnly: true, // Opciones del editor, incluyendo readOnly
//   };

//   ngOnInit(): void {
//     this.idMachinery = this.config.data.id;

//     if (this.idMachinery !== 0) {
//       this.onLoadData();
//     }
//   }

//   onLoadData() {
//     const urlApi = `MaintenanceCalendars/ListService/${this.idMachinery}`;
//     this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
//       this.maintenanceCalendars = responseData ;
//     });
//   }

//   confirm(event: Event, id: number) {
//     this.confirmationService.confirm({
//       target: event.target,
//       message: '¿Desea Eliminar este registro?',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         //confirm action

//         const urlApi = `MaintenanceCalendars/${id}`;
//         this.apiRequestS.onDelete(urlApi).then((responseData: boolean) => {
//           this.onLoadData();
//         });
//       },
//       reject: () => {
//         //reject action
//       },
//     });
//   }
//   showModalMaintenanceCalendar(data: any) {
//     this.dialogHandlerService
//       .openDialog(
//         AddoreditMaintenancePreventiveComponent,
//         {
//           id: data.id,
//           task: data.task,
//           idMachinery: data.idMachinery,
//         },
//         data.header,
//         this.dialogHandlerS.dialogSizeMd
//       )
//       .then((responseData: boolean) => {
//         if (responseData) this.onLoadData();
//       });
//   }
// }
