import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketGroupService {
  // apiRequestService = inject(ApiRequestService);
  // authService = inject(AuthService);

  ticketGroupMessageStatus: any = 0;

  messageInNotRead: number = 0;
  // Método para establecer el status y guardarlo en localStorage
  setStatus(ticketGroupMessageStatus: any): void {
    this.ticketGroupMessageStatus = ticketGroupMessageStatus;
  }

  // Url de imagen de tickets
  onGetPathUrlImage(customerId: string): string {
    return `${environment.base_urlImg}customers/${customerId}/report/`;
  }

  onLoadDataMessageInNotRead(): void {
    // const urlApi = `TicketMessage/MessageInNotRead/${this.authService.applicationUserId}`;
    // this.apiRequestService.onGetList(urlApi).then((result: any) => {
    //   this.messageInNotRead = result;
    // });
  }
}
