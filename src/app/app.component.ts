import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignalRService } from './core/services/signal-r.service';
import { UpdateService } from './core/services/update-pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  notificationPushService = inject(SignalRService);
  updateService = inject(UpdateService);
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
