import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';

@Component({
  selector: 'app-menu-select-customer',
  templateUrl: './menu-select-customer.component.html',
  standalone: true,
  imports: [FormsModule],
})
export default class MenuSelectCustomerComponent implements OnInit {
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);

  cb_customer: any[] = [];
  customerId = this.customerIdService.customerId;

  ngOnInit() {
    this.selectItemService
      .onGetSelectItem(
        `CustomersAcceso/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .subscribe((resp) => {
        this.cb_customer = resp;
      });
  }
  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);
  }
}
