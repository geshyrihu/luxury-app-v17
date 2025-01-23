import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FormsModule],
  providers: [DataConnectorService],
})
export default class CustomerSelectionComponent implements OnInit {
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);

  customerName = this.authS.infoUserAuthDto.customer;
  customerPhotoPath = this.authS.infoUserAuthDto.customerPhotoPath;

  cb_customer: any[] = [];
  customerId = this.custIdService.customerId;
  selectedCountry: string | undefined;
  ngOnInit() {
    this.cb_customer = this.authS.customerAccess;
  }
  selectCustomer(customerId: number) {
    this.custIdService.setCustomerId(customerId);
  }
}
