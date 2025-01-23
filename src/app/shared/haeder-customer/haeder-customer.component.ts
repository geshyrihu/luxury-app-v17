import {} from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-haeder-customer',
  templateUrl: './haeder-customer.component.html',
  standalone: true,
})
export default class HaederCustomerComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  filterReportOperationService = inject(TicketFilterService);

  logoCustomer = '';
  nameCustomer = '';
  customerId$: Observable<number> = this.custIdService.getCustomerId$();

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
    const urlApi = `Customers/${this.custIdService.customerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = `${environment.base_urlImg}Administration/customer/${result.photoPath}`;
    });
  }
}
