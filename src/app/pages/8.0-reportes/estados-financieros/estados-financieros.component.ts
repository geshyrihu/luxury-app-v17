import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-estados-financieros',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './estados-financieros.component.html',
})
export default class EstadosFinancierosComponent {
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
    const urlApi = `Reports/EstadosFinancieros/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result.estadosFinancieros;
      this.customerData = result.customer;
    });
  }
}
