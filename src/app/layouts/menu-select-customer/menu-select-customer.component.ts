import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';

@Component({
  selector: 'app-menu-select-customer',
  templateUrl: './menu-select-customer.component.html',
  standalone: true,
  imports: [FormsModule],
})
export default class MenuSelectCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_customer: any[] = [];
  customerId = this.customerIdService.customerId;

  ngOnInit() {
    this.selectItemService
      .onGetSelectItem(
        `CustomersAcceso/${this.authService.infoUserAuthDto.applicationUserId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp) => {
          this.cb_customer = resp;
        },
      });
  }
  selectCustomer(customerId: number) {
    this.customerIdService.setCustomerId(customerId);
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
