import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IAddCustomerPermisoToUser } from 'src/app/core/interfaces/add-customer-permiso-to-user.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
@Component({
  selector: 'app-access-customer',
  templateUrl: './access-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AccessCustomerComponent implements OnInit {
  customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);

  clientes: IAddCustomerPermisoToUser[] = [];
  ActualizarClientes: IAddCustomerPermisoToUser[] = [];
  checked = false;
  @Input()
  applicationUserId: string = '';

  ngOnInit(): void {
    this.onGetAccesCustomer();
  }
  onGetAccesCustomer() {
    this.apiRequestService
      .onGetList('AccesoCustomers/GetCustomers/' + this.applicationUserId)
      .then((result: any[]) => {
        this.clientes = result;
        this.ActualizarClientes = this.clientes;
      });
  }

  onUpdateAcceso(roles: any) {
    this.apiRequestService.onPost(
      `AccesoCustomers/AddCustomerAccesoToUser/${this.applicationUserId}`,
      roles
    );
  }
}
