import { Component, OnInit, inject } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalrCustomService } from 'src/app/core/services/signalrcustom.service';
import LegalTicketAddComponent from '../legal-ticket-add/legal-ticket-add.component';
import LegalTicketEditComponent from '../legal-ticket-edit/legal-ticket-edit.component';
import LegalTicketUpdateStatusComponent from '../legal-ticket-update-status/legal-ticket-update-status.component';
import TicketTrakingRequestDetailComponent from '../ticket-traking-request-detail/ticket-traking-request-detail.component';
import TicketTrakingComponent from '../ticket-traking/ticket-traking.component';

@Component({
  selector: 'app-legal-list-ticket',
  templateUrl: './legal-list-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalListTicketComponent implements OnInit {
  private dialogHandlerService = inject(DialogHandlerService);
  private apiRequestService = inject(ApiRequestService);
  private authService = inject(AuthService);
  private signalrcustomService = inject(SignalrCustomService);

  isSuperUser = this.authService.onValidateRoles(['SuperUsuario']);

  data: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    this.apiRequestService.onGetList('TicketLegal/All').then((result: any) => {
      this.data = result;
    });
    // this.signalrcustomService.hubConnection.on(
    //   'onLoadData ticket Legal',
    //   (respuesta) => {
    //     console.log('estamos desde el Componente.... ticket: ', respuesta);
    //   }
    // );
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketAddComponent,
        data,
        '',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onModalEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketEditComponent,
        data,
        '',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onModalUpdateStatus(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketUpdateStatusComponent,
        data,
        '',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalComentarios(data: any) {
    this.dialogHandlerService
      .openDialog(
        TicketTrakingComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerService.openDialog(
      TicketTrakingRequestDetailComponent,
      data,
      '',
      this.dialogHandlerService.dialogSizeMd
    );
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`TicketLegal/${id}`)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
