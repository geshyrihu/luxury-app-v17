import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import LuxuryChatAddOrEditComponent from '../luxury-chat-add-or-edit/luxury-chat-add-or-edit.component';
import { ELuxuryChatGroupMessageStatus } from '../luxury-chat-group-message-status.enum';
import { LuxuryChatInfoComponent } from '../luxury-chat-info/luxury-chat-info.component';
import LuxuryChatParticipantsComponent from '../luxury-chat-participants/luxury-chat-participants.component';
import { LuxuryChatService } from '../luxury-chat.service';
@Component({
  selector: 'app-luxury-chat-group-list',
  templateUrl: './luxury-chat-group-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbDropdownModule, ButtonModule],
})
export default class LuxuryChatGroupListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  swPush = inject(SwPush);
  router = inject(Router); // Injectamos Router.
  luxuryChatService = inject(LuxuryChatService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = `${environment.base_urlImg}customers/`;

  dataSignal = signal<any>(null);
  data: any;
  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `LuxuryChatGroup/GetAllByClient/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(result);
    });
  }
  onToggleStatus(id: string) {
    const urlApi = `LuxuryChatGroup/toggle-status/${id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.onLoadData();
    });
  }
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onInfo(data: any) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatInfoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalParticipants(data: any) {
    this.dialogHandlerService
      .openDialog(
        LuxuryChatParticipantsComponent,
        data,
        'Integrantes del grupo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  onNavigateMessage(
    luxuryChatGroupId: string,
    luxuryChatGroupMessageStatus: ELuxuryChatGroupMessageStatus
  ) {
    // this.luxuryChatService.luxuryChatGroupId = luxuryChatGroupId;
    this.luxuryChatService.luxuryChatGroupMessageStatus =
      luxuryChatGroupMessageStatus;
    this.luxuryChatService.setStatus(luxuryChatGroupMessageStatus);
    this.router.navigate(['/luxury-chat/messages/' + luxuryChatGroupId]);
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`LuxuryChatGroup/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id)
          );
      });
  }
}
