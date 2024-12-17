import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  route = inject(Router);
  authService = inject(AuthService);

  private hubConnection: HubConnection;

  private notificationSubject = new Subject<any>(); // Subject para recibir notificaciones
  private notificationUpdateSubject = new Subject<void>(); // Subject para emitir actualizaciones de lectura

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.base_signalr)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('hubConnection started'))
      .catch((err) => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveNotification', (data: any) => {
      if (
        data &&
        this.authService.applicationUserId === data.applicationUserId
      ) {
        this.showNotification(data); // Mostrar la notificación
        this.notificationSubject.next(data); // Emitimos el evento de notificación
      }
    });
  }

  private showNotification(data: any) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(data.title, {
        body: data.Message,
        icon: 'assets/images/icon.png',
      });

      notification.onclick = () => {
        this.route.navigate(['/tickets/message/' + data.ticketMessageId]);
      };

      const audio = new Audio('assets/audio/notification-sound.mp3');
      audio.play();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.showNotification(data);
        }
      });
    }
  }

  // Observable para las notificaciones recibidas
  getNotificationObservable(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  // Emitir actualización de lectura
  emitNotificationUpdate() {
    this.notificationUpdateSubject.next();
  }

  // Observable para las actualizaciones de lectura
  getNotificationUpdateObservable(): Observable<void> {
    return this.notificationUpdateSubject.asObservable();
  }
}
