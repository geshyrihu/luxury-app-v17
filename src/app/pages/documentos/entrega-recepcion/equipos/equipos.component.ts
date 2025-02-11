import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import StripTagsPipe from 'src/app/core/pipes/StripTags.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, StripTagsPipe],
})
export default class EquiposComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `entregarecepcion/inventarioequipos/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  calcularEquiposTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }
    return total;
  }
}
