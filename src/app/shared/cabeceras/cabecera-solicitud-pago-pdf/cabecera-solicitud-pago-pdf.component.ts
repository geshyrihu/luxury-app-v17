import {} from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-cabecera-solicitud-pago-pdf',
  templateUrl: './cabecera-solicitud-pago-pdf.component.html',
  standalone: true,
})
export default class CabeceraSolicitudPagoPdfComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);

  data: any;

  url: string = '';
  @Input()
  titulo: string = '';
  @Input()
  folio: string = '';
  @Input()
  factura: string = '';

  ngOnInit(): void {
    this.onloadData();
  }

  onloadData() {
    const urlApi = 'Customers/' + this.custIdService.getCustomerId();
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
