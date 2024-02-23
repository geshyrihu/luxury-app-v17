import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import LegalTicketAddOrEditComponent from '../legal-ticket-add-or-edit/legal-ticket-add-or-edit.component';
import TicketTrakingComponent from '../ticket-traking/ticket-traking.component';

@Component({
  selector: 'app-legal-list-ticket',
  templateUrl: './legal-list-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalListTicketComponent implements OnInit {
  public dialogHandlerService = inject(DialogHandlerService);
  public apiRequestService = inject(ApiRequestService);

  data: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    this.apiRequestService
      .onGetList('TicketLegal/alllegal')
      .then((result: any) => {
        this.data = result;
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketAddOrEditComponent,
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
  onModalComentarios(data: any) {
    this.dialogHandlerService.openDialog(
      TicketTrakingComponent,
      data,
      data.title,
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
