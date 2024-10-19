import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
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
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  ticketGroupService = inject(TicketGroupService);

  ticketMessageId: string = this.activatedRoute.snapshot.params.ticketMessageId;
  urlImage = this.ticketGroupService.onGetPathUrlImage(
    this.customerIdService.customerId.toString()
  );
  data: any = {};

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `TicketMessage/View/${this.ticketMessageId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
      this.onUpdateReader();
    });
  }

  onUpdateReader() {
    const urlApi = `TicketMessage/UpdateReader/${this.ticketMessageId}/${this.authService.applicationUserId}`;
    this.apiRequestService.onGetList(urlApi);
  }
}
