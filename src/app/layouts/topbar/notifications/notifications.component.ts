import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subscription } from 'rxjs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { TicketGroupService } from 'src/app/pages/5.3-tickets/ticket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: true,
  imports: [SimplebarAngularModule, LuxuryAppComponentsModule],
})
export default class NotificationsComponent implements OnInit, OnDestroy {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
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
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
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
