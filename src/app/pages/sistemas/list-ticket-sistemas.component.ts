// import { Component, OnInit, inject } from '@angular/core';
// import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
// import { DynamicDialogRef } from 'primeng/dynamicdialog';
// import { EStatus } from 'src/app/core/enums/status.enum';
// import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
// import { ApiRequestService } from 'src/app/core/services/api-request.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
// import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
// import { SistemasReporteService } from 'src/app/core/services/sistemas-reporte.service';
// import { environment } from 'src/environments/environment';
// import CardEmployeeComponent from '../../directorios/employee-internal/card-employee/card-employee.component';
// import TicketSeguimientoComponent from '../../tickets-v2/ticket-seguimiento/ticket-seguimiento.component';
// import AddoreditTicketSistemasComponent from './addoredit-ticket-sistemas-reporte/addoredit-ticket-sistemas.component';

// @Component({
//   selector: 'app-list-ticket-sistemas.component',
//   templateUrl: './list-ticket-sistemas.component.html',
//   standalone: true,
//   imports: [LuxuryAppComponentsModule],
// })
// export default class SistemasReporteComponent implements OnInit {
//   apiRequestService = inject(ApiRequestService);
//   dialogHandlerService = inject(DialogHandlerService);
//   authS = inject(AuthService);

//   public sistemasReporteService = inject(SistemasReporteService);
//   private filtroCalendarService = inject(FiltroCalendarService);

//   ref: DynamicDialogRef;

//   data: any[] = [];
//   listCustomer: any[] = [];

//   cb_responsableSistemas: ISelectItem[] = [];
//   responsableSistemas: string = this.authS.applicationUserId;
//   status: EStatus = EStatus.Pendiente;

//   applicationUserId: string = this.authS.applicationUserId;

//   pendientes: number = 0;
//   concluidos: number = 0;
//   urlAccount = environment.url_account;

//   ngOnInit(): void {
//     this.onLoadSelectItem();
//     this.onLoadData(this.status, this.responsableSistemas);
//   }

//   onLoadData(status: EStatus, applicationUserId: string): void {
//     const urlApi = `TicketsSistemas/List/${status}/${applicationUserId}`;
//     this.apiRequestService.onGetList(urlApi).then((result: any) => {
//       this.data = result;
//     });
//   }
//   onLoadSelectItem() {
//     this.apiRequestService
//       .onGetSelectItem(`responsableSistemas`)
//       .then((response: any) => {
//         this.cb_responsableSistemas = response;
//       });
//   }

//   onChangeResponsible(applicationUserId: string) {
//     this.responsableSistemas = applicationUserId;
//     this.onLoadData(this.status, this.responsableSistemas);
//   }
//   onStatusChange(status: EStatus) {
//     this.status = status;
//     this.onLoadData(this.status, this.responsableSistemas);
//   }

//   onFilterItems(data: any[], status: number): number {
//     const a = data.filter((resp) => resp.status === status);
//     return a.length;
//   }
//   onChangeUser() {
//     if (this.applicationUserId == '') {
//       this.applicationUserId = this.authS.applicationUserId;
//     } else {
//       this.applicationUserId = null;
//     }
//     this.onLoadData(this.status, this.responsableSistemas);
//   }

//   showModalAddOrEdit(data: any) {
//     this.dialogHandlerService
//       .openDialog(
//         AddoreditTicketSistemasComponent,
//         { id: data.id, status: data.status },
//         data.title,
//         this.dialogHandlerService.dialogSizeLg
//       )
//       .then((result: any) => {
//         if (result !== undefined)
//           this.onLoadData(this.status, this.responsableSistemas);
//       });
//   }

//   eliminarTiket(id: number) {
//     this.apiRequestService
//       .onDelete(`Ticket/DeleteFinal/${id}`)
//       .then((result: boolean) => {
//         if (result) this.data = this.data.filter((item) => item.id !== id);
//       });
//   }

//   onCardEmployee(applicationUserId: string) {
//     this.dialogHandlerService.openDialog(
//       CardEmployeeComponent,
//       { applicationUserId },
//       'Colaborador',
//       this.dialogHandlerService.dialogSizeMd
//     );
//   }

//   onModalsSeguimiento(id: number) {
//     this.dialogHandlerService
//       .openDialog(
//         TicketSeguimientoComponent,
//         { id },
//         'Seguimientos',
//         this.dialogHandlerService.dialogSizeLg
//       )
//       .then((result: boolean) => {
//         if (result) this.onLoadData(this.status, this.responsableSistemas);
//       });
//   }
// }
