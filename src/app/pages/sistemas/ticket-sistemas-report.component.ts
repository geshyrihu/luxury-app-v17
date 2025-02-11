// import { Component, OnInit, inject } from "@angular/core";
// import { FlatpickrModule } from "angularx-flatpickr";
// import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
// import flatpickr from "flatpickr";
// import { Spanish } from "flatpickr/dist/l10n/es";
// import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
// import { ApiRequestService } from "src/app/core/services/api-request.service";
// import { AuthService } from "src/app/core/services/auth.service";
// import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// export function flatpickrFactory() {
//   flatpickr.localize(Spanish);
//   return flatpickr;
// }
// @Component({
//   selector: "app-ticket-sistemas-report",
//   templateUrl: "./ticket-sistemas-report.component.html",
//   standalone: true,
//   imports: [LuxuryAppComponentsModule, FlatpickrModule],
// })
// export default class TicketSistemasReportComponent implements OnInit {
//   apiRequestS = inject(ApiRequestService);
//    dialogHandlerS = inject(DialogHandlerService);
//   authS = inject(AuthService);

//   constructor() {
//     flatpickrFactory();
//   }

//   cb_responsableSistemas: ISelectItem[] = [];
//   responsableSistemas: string = this.authS.applicationUserId;
//   dateInitial: string = "";
//   dateFinal: string = "";

//   sumatotalSolicitudes;
//   sumatotalAtendidas;
//   sumatotalPendientes;
//   sumatotalCanceladas;
//   dataClient: any[] = [];
//   ngOnInit(): void {
//     this.onLoadSelectItem();
//   }

//   onChangeResponsible(applicationUserId: string) {
//     this.responsableSistemas = applicationUserId;
//   }

//   onLoadData() {
//     this.apiRequestService
//       .onGetItem(
//         `TicketsSistemas/Report/${this.responsableSistemas}/${this.dateInitial}/${this.dateFinal}`
//       )
//       .then((result: any) => {
//         this.dataClient = result;
//         this.onCalculateTotal();
//       });
//   }
//   onLoadSelectItem() {
//     this.apiRequestService
//       .onGetSelectItem(`responsableSistemas`)
//       .then((response: any) => {
//         this.cb_responsableSistemas = response;
//       });
//   }

//   onCalculateTotal() {
//     let totalSolicitudes = 0;
//     let totalAtendidas = 0;
//     let totalPendientes = 0;
//     let totalCanceladas = 0;
//     for (let item of this.dataClient) {
//       totalSolicitudes += item.totalSolicitudes;
//       totalAtendidas += item.totalAtendidas;
//       totalPendientes += item.totalPendientes;
//       totalCanceladas += item.totalCanceladas;
//     }

//     this.sumatotalSolicitudes = totalSolicitudes;
//     this.sumatotalAtendidas = totalAtendidas;
//     this.sumatotalPendientes = totalPendientes;
//     this.sumatotalCanceladas = totalCanceladas;
//   }
// }
