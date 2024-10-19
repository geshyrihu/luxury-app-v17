import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
@Component({
  selector: 'app-minuta-pendientes',
  templateUrl: './minuta-pendientes.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, EStatusPipe],
})
export default class MinutaPendientesComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  data: any[] = [];
  todoElSeguimiento: boolean = true;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `Meetings/MinutaAllPendientes/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
