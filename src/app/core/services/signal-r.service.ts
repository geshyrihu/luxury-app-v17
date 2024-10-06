import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  route = inject(Router);

  private hubConnection: HubConnection;

  private notificationSubject = new Subject<any>(); // Usamos un Subject para emitir los datos

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.base_signalr)
      .build();
    console.log('Conectando...');

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveNotification', (data: any) => {
      console.log('🚀 ~ ReceiveNotification:', data);

      if (data.clave === 'Nuevo') {
        this.showNotification(data);
        this.notificationSubject.next(data); // Emitimos el evento
      }
      if (data.clave === 'Reader') {
        console.log('🚀 ~ data.clave:', data.clave);
        this.notificationSubject.next(data); // Emitimos el evento
      }

      // crear logica para mostrar notificación
    });
  }

  private showNotification(data: any) {
    // Mostrar la notificación con los datos recibidos

    if (Notification.permission === 'granted') {
      const notification = new Notification(data.title, {
        body: data.Message,
        icon: 'assets/images/icon.png', // Especifica el ícono aquí
      });

      notification.onclick = () => {
        // Crear accion para ver la nmotificación
        this.route.navigate(['/luxury-chat/message/' + data.ticketMessageId]);
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

  // Método para exponer el observable
  getNotificationObservable() {
    return this.notificationSubject.asObservable();
  }
}
