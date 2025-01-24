import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { environment } from 'src/environments/environment';

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
  urlLogoCustomer = `${environment.base_urlImg}Administration/customer/`;
  urlImage = environment.base_urlImg;
  customer: string = '';
  inicio: string = '';
  final: string = '';

  ngOnInit(): void {
    this.customer = this.rutaActiva.snapshot.params.customer;
    this.inicio = this.rutaActiva.snapshot.params.inicio;
    this.final = this.rutaActiva.snapshot.params.final;

    this.urlImage = `${environment.base_urlImg}customers/${this.customer}/report/`;

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
