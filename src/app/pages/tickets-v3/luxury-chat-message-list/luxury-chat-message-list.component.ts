import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import CardEmployeeComponent from '../../employee/card-employee/card-employee.component';
import { LuxuryChatResult } from '../interfaces/luxury-chat-message-list';
import { ELuxuryChatGroupMessageStatus } from '../luxury-chat-group-message-status.enum';
import LuxuryChatMessageAddOrEditComponent from '../luxury-chat-message-add-or-edit/luxury-chat-message-add-or-edit.component';
import LuxuryChatMessageCloseComponent from '../luxury-chat-message-close/luxury-chat-message-close.component';
import LuxuryChatMessageFollowupComponent from '../luxury-chat-message-followup/luxury-chat-message-followup.component';
import LuxuryChatMessageProgramComponent from '../luxury-chat-message-program/luxury-chat-message-program.component';
import LuxuryChatMessageReopenComponent from '../luxury-chat-message-reopen/luxury-chat-message-reopen.component';
import { LuxuryChatService } from '../luxury-chat.service';
@Component({
  selector: 'app-luxury-chat-message-list',
  templateUrl: './luxury-chat-message-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LuxuryChatMessageListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  luxuryChatService = inject(LuxuryChatService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  activatedRoute = inject(ActivatedRoute);

  data: LuxuryChatResult = {
    nameChat: '',
    items: [],
  };

  luxuryChatGroupId: string =
    this.activatedRoute.snapshot.params.luxuryChatGroupId;
  status: string =
    this.luxuryChatService.luxuryChatGroupMessageStatus.toString();

  urlAccount = environment.url_account;
  urlImage = this.luxuryChatService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );

  cb_status: ISelectItem[] = onGetSelectItemFromEnum(
    ELuxuryChatGroupMessageStatus
  );

  ngOnInit(): void {
    this.onLoadData(this.status);
  }

  onLoadData(status: any) {
    const urlApi = `LuxuryChatMessage/List/${this.luxuryChatGroupId}/${status}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
      this.status_color = this.getIconClass();
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatMessageAddOrEditComponent,
        { id: data.id, luxuryChatGroupId: this.luxuryChatGroupId },
        'Agregar',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onProgram(id: string) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatMessageProgramComponent,
        { id: id },
        'Programar actividad',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
  onReopen(id: string) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatMessageReopenComponent,
        { id: id },
        'Refutar ticket',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }

  onProgress(id: string) {
    Swal.fire({
      title: 'Confirmar',
      text: 'Se colocara el ticket en proceso',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, en proceso!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        const urlApi = `LuxuryChatMessage/InProgress/${id}`;

        this.apiRequestService.onGetItem(urlApi).then((result: any) => {
          // Actualizamos el valor del signal con los datos recibidos
          this.onLoadData(this.status);
        });
      }
    });
  }

  onClosed(id: string) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatMessageCloseComponent,
        { id: id },
        'Cerrar ticket',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }

  // Actualizar si el item es relevante o no
  onUpdateStateTicket(item: any) {
    const urlApi = `LuxuryChatMessage/UpdateRelevance/${item.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.customToastService.onCloseToSuccess();
    });
  }

  onReloadData(status: any) {
    this.luxuryChatService.setStatus(status);
    this.onLoadData(this.status);
    this.status_color = this.getIconClass();
  }

  status_color: string = 'primary'; // Valor inicial
  getIconClass() {
    switch (this.status) {
      case '0':
        return 'text-danger';
      case '1':
        return 'text-warning';
      case '3':
        return 'text-primary';
      case '2':
        return 'text-success';
    }
  }

  onFollowUp(id: string) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatMessageFollowupComponent,
        { id: id },
        'Comentarios',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.status);
      });
  }
}
