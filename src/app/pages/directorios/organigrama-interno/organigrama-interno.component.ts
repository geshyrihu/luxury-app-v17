import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
    selector: 'app-organigrama-interno',
    templateUrl: './organigrama-interno.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class OrganigramaInternoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);

  nameCustomer: string = '';
  logoCustomer: string = '';
  data: any[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.OnLoadCustomer();
    this.customerId$.subscribe(() => {
      this.onLoadData();
      this.OnLoadCustomer();
    });
  }

  onLoadData() {
    const urlApi = 'OrganigramaInterno/' + this.customerIdS.getCustomerId();
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  OnLoadCustomer() {
    this.apiRequestS
      .onGetItem(`Customers/${this.customerIdS.customerId}`)
      .then((responseData: any) => {
        this.nameCustomer = responseData.nameCustomer;
      });
  }
}
