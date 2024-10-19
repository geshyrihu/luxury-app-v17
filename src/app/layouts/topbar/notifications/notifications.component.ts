import { Component, inject, OnInit, signal } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subscription } from 'rxjs';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { TicketGroupService } from 'src/app/pages/5.0-tickets-v3/ticket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  standalone: true,
  imports: [SimplebarAngularModule, LuxuryAppComponentsModule],
})
export default class NotificationsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  ticketGroupService = inject(TicketGroupService);
  signalRService = inject(SignalRService); // Inyecta el NotificationService

  messageInNotRead: number = 0;
  dataSignal = signal<number>(0);

  private notificationSubscription: Subscription;
  ngOnInit() {
    this.onLoadNotification();

    // Suscribirse al observable de notificaciones
    this.notificationSubscription = this.signalRService
      .getNotificationObservable()
      .subscribe((notificationData) => {
        console.log(
          'Notificación recibida en el componente hijo:',
          notificationData
        );
        this.onLoadNotification();
        // Aquí puedes manejar la notificación en el componente hijo
      });
  }

  onLoadNotification() {
    // const urlApi = `TicketMessage/MessageNotRead/${this.authService.applicationUserId}`;
    // this.apiRequestService.onGetList(urlApi).then((result: any) => {
    //   this.messageInNotRead = result;
    // });
  }

  ngOnDestroy() {
    // Desuscribirse cuando el componente se destruya para evitar fugas de memoria
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
}
