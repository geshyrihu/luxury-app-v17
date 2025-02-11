import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subscription } from 'rxjs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { TicketGroupService } from 'src/app/pages/tickets/ticket.service';

@Component({
    selector: 'app-home-notification',
    imports: [SimplebarAngularModule, LuxuryAppComponentsModule],
    templateUrl: './home-notification.component.html'
})
export default class HomeNotificationComponent implements OnInit, OnDestroy {
  apiRequestS = inject(ApiRequestService);
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
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.notifications = responseData;
      this.notifications.forEach((x: any) => {
        if (!x.isRead) {
          this.messageInNotRead++;
        }
      });
    });
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
