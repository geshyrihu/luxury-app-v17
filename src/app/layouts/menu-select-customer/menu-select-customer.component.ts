import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
@Component({
  selector: 'app-menu-select-customer',
  templateUrl: './menu-select-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FormsModule],
  providers: [DataService],
})
export default class MenuSelectCustomerComponent implements OnInit {
  authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);

  cb_customer: any[] = [];
  customerId = this.customerIdService.customerId;

  ngOnInit() {
    this.apiRequestService
      .onGetSelectItem(
        `CustomersAcceso/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .then((resp: any) => {
        this.cb_customer = resp;
      });
  }
  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);
  }
}
