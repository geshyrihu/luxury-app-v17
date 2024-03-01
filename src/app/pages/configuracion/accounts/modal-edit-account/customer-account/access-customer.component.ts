import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IAddCustomerPermisoToUserDto } from 'src/app/core/interfaces/IAddCustomerPermisoToUserDto.interface';
import {
  ApiRequestService,
  CustomToastService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-access-customer',
  templateUrl: './access-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AccessCustomerComponent implements OnInit {
  public customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  clientes: IAddCustomerPermisoToUserDto[] = [];
  ActualizarClientes: IAddCustomerPermisoToUserDto[] = [];
  checked = false;
  @Input()
  applicationUserId: string = '';

  ngOnInit(): void {
    this.onGetAccesCustomer();
  }
  onGetAccesCustomer() {
    this.apiRequestService
      .onGetList('AccessToClients/GetCustomers/' + this.applicationUserId)
      .then((result: any[]) => {
        this.clientes = result;
        this.ActualizarClientes = this.clientes;
      });
  }

  onUpdateAcceso(roles: any) {
    this.apiRequestService.onPost(
      `AccessToClients/AddCustomerAccesoToUser/${this.applicationUserId}`,
      roles
    );
  }
}
