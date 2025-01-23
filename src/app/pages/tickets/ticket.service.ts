import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TicketGroupService {
  year: number = 0;
  numeroSemana: number = 0;
  /**
   *
   */
  constructor() {
    this.setCurrentWeekAndYear();
  }

  setCurrentWeekAndYear(): void {
    const today = new Date();
    this.year = today.getFullYear();
    this.numeroSemana = this.getWeekNumber(today);
  }

  getWeekNumber(date: Date): number {
    const d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Establecer a lunes
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  ticketGroupMessageStatus: any = 0;

  messageInNotRead: number = 0;
  // Método para establecer el status y guardarlo en localStorage
  setStatus(ticketGroupMessageStatus: any): void {
    this.ticketGroupMessageStatus = ticketGroupMessageStatus;
  }

  onLoadDataMessageInNotRead(): void {
    // const urlApi = `TicketMessage/MessageInNotRead/${this.authS.applicationUserId}`;
    // this.apiRequestService.onGetList(urlApi).then((result: any) => {
    //   this.messageInNotRead = result;
    // });
  }
}
