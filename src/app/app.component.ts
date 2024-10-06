import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignalRService } from './core/services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  notificationPushService = inject(SignalRService);
  ngOnInit() {
    this.requestNotificationPermission();
  }

  requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Permiso para notificaciones concedido.');
      }
    });
  }
}
