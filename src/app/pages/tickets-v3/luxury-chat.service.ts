import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ELuxuryChatGroupMessageStatus } from './luxury-chat-group-message-status.enum';

@Injectable({
  providedIn: 'root',
})
export class LuxuryChatService {
  luxuryChatGroupMessageStatus: any = 0;

  constructor() {
    // Recuperar el valor de localStorage al inicializar el servicio
    this.loadFromLocalStorage();
  }

  // Método para establecer el status y guardarlo en localStorage
  setStatus(luxuryChatGroupMessageStatus: ELuxuryChatGroupMessageStatus): void {
    // this.luxuryChatGroupId = id;
    localStorage.setItem(
      'luxuryChatGroupMessageStatus',
      luxuryChatGroupMessageStatus.toString()
    );
  }
  // Método para recuperar luxuryChatGroupMessageStatus desde localStorage
  private loadFromLocalStorage(): void {
    const storedId = localStorage.getItem('luxuryChatGroupMessageStatus');
    if (storedId) {
      this.luxuryChatGroupMessageStatus = storedId;
    }
  }
  // Url de imagen de tickets
  onGetPathUrlImage(customerId: string): string {
    return `${environment.base_urlImg}customers/${customerId}/ticket/`;
  }
}
