import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-llaves',
  templateUrl: './llaves.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LlavesComponent implements OnInit {
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
    const urlApi = `EntregaRecepcion/InventarioLlaves/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  calcularEquiposTotal(name) {
    let total = 0;
    if (this.data) {
      for (let customer of this.data) {
        if (customer.descripcion === name) {
          total++;
        }
      }
    }
    return total;
  }
}
