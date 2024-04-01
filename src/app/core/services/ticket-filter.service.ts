import { Injectable, inject } from '@angular/core';
import { IFilterTicket } from 'src/app/core/interfaces/filter-ticket.interface';
import { AuthService } from './auth.service';
import { CustomerIdService } from './customer-id.service';
@Injectable({
  providedIn: 'root',
})
export class TicketFilterService {
  authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);

  filterTicket: IFilterTicket = {
    customer: this.customerIdService.customerId,
    status: 0,
    responsible: '',
    request: '',
    requestStart: '',
    finishedStart: '',
    requestEnd: '',
    finishedEnd: '',
    priority: '',
    folioReporte: null,
  };

  setIdCustomer(customerId: number) {
    this.filterTicket.customer = customerId;
  }
  setStateDenegade() {
    this.filterTicket.status = 2;
  }
  getIdCustomer() {
    return this.filterTicket.customer;
  }
  get getfilterTicket() {
    return this.filterTicket;
  }
  setfilterTicket(filterTicket: IFilterTicket) {
    this.filterTicket = filterTicket;
  }
}
