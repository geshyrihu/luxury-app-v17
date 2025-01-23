import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { differenceInDays } from 'date-fns'; // Utilidad para calcular la diferencia en días
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contracts-policies',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './contracts-policies.component.html',
})
export default class ContractsPoliciesComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  data: any[] = [];

  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  urlBase = environment.base_urlImg;

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `ContratoPoliza/GetAll/${this.custIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  // Suponiendo que 'item.endDate' es una fecha en formato ISO o de tipo Date
  isCloseToEndDate(endDate: string | Date): boolean {
    const today = new Date();
    const end = new Date(endDate);
    const daysDifference = differenceInDays(end, today);
    return daysDifference <= 45;
  }
}
