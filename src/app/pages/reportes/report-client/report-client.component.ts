import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-report-client',
  templateUrl: './report-client.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReportClientComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  rutaActiva = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);

  data: any = [];

  customer: string = '';
  inicio: string = '';
  final: string = '';
  rutaFinal: string = '';

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;
    this.rutaFinal = `Tickets/GetReportClient/${this.customer}/${this.inicio}/${this.final}`;

    this.apiRequestS.onGetList(this.rutaFinal).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }
}
