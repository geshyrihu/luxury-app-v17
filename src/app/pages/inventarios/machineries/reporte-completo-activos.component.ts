import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-reporte-completo-activos',
  templateUrl: './reporte-completo-activos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteCompletoActivosComponent implements OnInit {
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);
  messageS = inject(MessageService); // private reporteActivosPdfService: ReporteActivosPdfService

  data: any[] = [];
  titulo: string = '';

  customerId: number;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.customerId = this.customerIdS.getCustomerId();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.customerId = this.customerIdS.getCustomerId();
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = 'Machineries/InventarioCompleto/' + this.customerId;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = responseData;
    });
  }
}
