import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-view',
  templateUrl: './ticket-message-view.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketMessageViewComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  activatedRoute = inject(ActivatedRoute);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  ticketGroupService = inject(TicketGroupService);
  signalRService = inject(SignalRService);

  ticketMessageId: string;
  notificationUserId: string;
  urlImage = this.ticketGroupService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );
  data: any = {};

  ngOnInit() {
    // Suscribirse a los parámetros de la ruta para detectar cambios
    this.activatedRoute.params.subscribe((params) => {
      this.ticketMessageId = params['ticketMessageId'];
      this.notificationUserId = params['notificationUserId'];
      this.onLoadData(); // Cargar datos cada vez que cambien los parámetros
    });
  }

  onLoadData() {
    const urlApi = `TicketMessage/View/${this.ticketMessageId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onUpdateReader(); // Marcar como leído cuando se cargan los datos
    });
  }

  onUpdateReader() {
    const urlApi = `NotificationUser/UpdateToRead/${this.authS.applicationUserId}/${this.notificationUserId}`;
    this.apiRequestService.onGetItem(urlApi).then(() => {
      this.signalRService.emitNotificationUpdate(); // Emitir actualización de lectura
    });
  }
}
