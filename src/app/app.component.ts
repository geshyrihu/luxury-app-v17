import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  public readonly VAPID_PUBLIC_KEY =
    'BLyERCTal5NU6PuSo5_qo-umI39RFfBpCxsXMEpD5QMaDMmDdKRU_lqdJ5ldAlSaJIfJGSRqaGIrP-R7n4OueH8';

  constructor(private swPush: SwPush, private dataService: DataService) {}

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        this.dataService.get('Newsletter/AddPushSubscriber').subscribe();
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }
}
