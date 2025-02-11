import {} from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';

@Component({
  selector: 'app-haeder-customer',
  templateUrl: './haeder-customer.component.html',
  standalone: true,
})
export default class HaederCustomerComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  filterReportOperationService = inject(TicketFilterService);

  logoCustomer = '';
  nameCustomer = '';
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  @Input()
  title: string = 'Titulo de cabecera';
  @Input()
  subTitle: string = '';

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `Customers/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.nameCustomer = responseData.nameCustomer;
      this.logoCustomer = responseData.photoPath;
    });
  }
}
