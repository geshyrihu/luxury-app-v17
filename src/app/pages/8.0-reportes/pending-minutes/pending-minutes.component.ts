import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-pending-minutes',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './pending-minutes.component.html',
})
export default class PendingMinutesComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);

  data: any;
  customerData: any;
  administrador: any;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  customerId = this.customerIdService.getCustomerId();
  ngOnInit(): void {
    this.onLoadData(this.customerId);
    this.customerId$.subscribe((customerId) => {
      this.onLoadData(customerId);
    });
  }

  onLoadData(customerId: number) {
    const urlApi = `Reports/PendingMinutes/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result.pendings;
      this.customerData = result.customer;
      this.administrador = result.administrador;
    });
  }
}
