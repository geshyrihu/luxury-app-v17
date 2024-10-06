import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<void>();

  // Método para emitir una notificación de actualización
  notifyUpdate() {
    this.notificationSubject.next();
  }

  // Observable al que se suscriben los componentes que necesitan reaccionar a la actualización
  getNotificationObservable() {
    return this.notificationSubject.asObservable();
  }
}
