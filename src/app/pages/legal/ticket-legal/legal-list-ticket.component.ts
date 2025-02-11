// Imports propios de Angular
import { Component, OnInit, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

// Imports creados por tu servidor
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import LegalTicketAddComponent from './legal-ticket-add.component';
import LegalTicketEditComponent from './legal-ticket-edit.component';
import LegalTicketUpdateStatusComponent from './legal-ticket-update-status.component';
import TicketTrakingRequestDetailComponent from './ticket-traking-request-detail.component';
import TicketTrakingComponent from './ticket-traking.component';

@Component({
  selector: 'app-legal-list-ticket',
  templateUrl: './legal-list-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalListTicketComponent implements OnInit {
  private dialogHandlerS = inject(DialogHandlerService);
  private apiRequestS = inject(ApiRequestService);
  private authS = inject(AuthService);

  isSuperUser = this.authS.onValidateRoles(['SuperUsuario']);

  data: any[] = [];
  inputValue: string = '';

  ngOnInit() {
    this.onLoadData();
    // this.onModalAddOrEdit({ id: '', title: 'AGREGAR TICKET LEGAL' });
  }

  onLoadData() {
    this.apiRequestS
      .onGetList('TicketLegal/AllLegal')
      .then((responseData: any) => {
        this.data = responseData;
      });
  }

  // clearInput() {
  //   this.inputValue = null; // Establece el valor del input en null
  //   this.onFilter(null); // Llama a la función onFilter con el valor null
  // }

  // onFilter(mesanio: any) {
  //   this.apiRequestService
  //     .onGetList('TicketLegal/AllLegal/' + mesanio)
  //     .then((responseData: any) => {
  //       this.data = responseData;
  //     });
  // }
  onModalEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        LegalTicketEditComponent,
        data,
        '',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.onLoadData();
        }
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        LegalTicketAddComponent,
        data,
        '',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.onLoadData();
        }
      });
  }

  onModalUpdateStatus(data: any) {
    this.dialogHandlerS
      .openDialog(
        LegalTicketUpdateStatusComponent,
        data,
        '',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.onLoadData();
        }
      });
  }

  onModalSeguimiento(data: any) {
    this.dialogHandlerS
      .openDialog(
        TicketTrakingComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.onLoadData();
        }
      });
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerS.openDialog(
      TicketTrakingRequestDetailComponent,
      data,
      '',
      this.dialogHandlerS.dialogSizeMd
    );
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`TicketLegal/${id}`)
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  // PendingEmail() {
  //   const urlApi = `TicketLegal/PendingEmail`;
  //   this.apiRequestS.onGetItem(urlApi);
  // }
}
