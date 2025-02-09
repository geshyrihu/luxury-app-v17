import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-organigrama-interno',
  templateUrl: './organigrama-interno.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrganigramaInternoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);

  nameCustomer: string = '';
  logoCustomer: string = '';
  data: any[] = [];
  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.OnLoadCustomer();
    this.customerId$.subscribe(() => {
      this.onLoadData();
      this.OnLoadCustomer();
    });
  }

  onLoadData() {
    const urlApi = 'OrganigramaInterno/' + this.custIdService.getCustomerId();
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  OnLoadCustomer() {
    this.apiRequestService
      .onGetItem(`Customers/${this.custIdService.customerId}`)
      .then((result: any) => {
        this.nameCustomer = result.nameCustomer;
      });
  }
}
