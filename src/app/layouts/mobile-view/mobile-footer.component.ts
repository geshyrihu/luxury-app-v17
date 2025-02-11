import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { TicketGroupService } from 'src/app/pages/tickets/ticket.service';

@Component({
  selector: 'app-mobile-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './mobile-footer.component.html',
})
export default class MobileFooterComponent implements OnInit, OnDestroy {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  ticketGroupService = inject(TicketGroupService);
  signalRService = inject(SignalRService);

  messageInNotRead: number = 0;
  notifications: any[] = [];
  private notificationSubscription: Subscription;
  private notificationUpdateSubscription: Subscription;

  ngOnInit() {
    this.onLoadNotification();

    // Suscribirse al observable de notificaciones recibidas
    this.notificationSubscription = this.signalRService
      .getNotificationObservable()
      .subscribe((_) => {
        this.onLoadNotification();
      });

    // Suscribirse a las actualizaciones de lectura
    this.notificationUpdateSubscription = this.signalRService
      .getNotificationUpdateObservable()
      .subscribe(() => {
        this.onLoadNotification();
      });
  }

  onGetUrl(a: string, b: string) {
    return `${a}/${b}`;
  }
  onLoadNotification() {
    this.messageInNotRead = 0;
    this.notifications = [];
    const urlApi = `NotificationUser/GetAllUnread/${this.authS.applicationUserId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.notifications = result;
      this.notifications.forEach((x: any) => {
        if (!x.isRead) {
          this.messageInNotRead++;
        }
      });
    });
  }

  getTruncatedMessage(message: string, maxLength: number): string {
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.notificationUpdateSubscription) {
      this.notificationUpdateSubscription.unsubscribe();
    }
  }
}
