import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

import { Observable } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TopbarModule } from './topbar.module';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [TopbarModule],
})
export class TopbarComponent implements OnInit {
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  @Output() settingsButtonClicked = new EventEmitter();

  customerId: number;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  customerName = this.authS.infoUserAuthDto.customer;
  customerPhotoPath = this.authS.infoUserAuthDto.customerPhotoPath;

  valueset: any;

  ngOnInit() {
    this.onReloadDataCustomer();
    this.customerId$.subscribe((resp) => {
      this.onReloadDataCustomer();

      console.log('Cambiando de cliente en el sidebar menu');
    });
  }

  onReloadDataCustomer() {
    if (this.authS.customerAccess.length == 1) {
      this.customerName = this.authS.infoUserAuthDto.customer;
      this.customerPhotoPath = this.authS.infoUserAuthDto.customerPhotoPath;
    } else {
      this.customerName = this.customerIdS.nameCustomer;
      this.customerPhotoPath = this.customerIdS.photoPath;
    }
  }

  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  @Output()
  mobileMenuButtonClicked = new EventEmitter();
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
}
