import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-operation-report-client',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './operation-report-client.component.html',
})
export default class OperationReportClientComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  rutaActiva = inject(ActivatedRoute);

  data: any = [];
  customer: string = '';
  inicio: string = '';
  final: string = '';

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;

    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TicketReport/GetReportClient/${this.customer}/${this.inicio}/${this.final}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }
}
