import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-pdf-solicitud-compra',
    templateUrl: './pdf-solicitud-compra.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class PdfSolicitudCompraComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  route = inject(ActivatedRoute);

  idSolicituCompra: any;
  folioCotizacion = '';
  model: any;

  ngOnInit(): void {
    this.idSolicituCompra = this.route.snapshot.paramMap.get('id');

    this.apiRequestS
      .onGetItem(
        `SolicitudCompra/GetSolicitudCompraIndividual/${this.idSolicituCompra}`
      )
      .then((responseData: any) => {
        this.folioCotizacion = responseData.folio;
        this.model = responseData.solicitudCompraDetalle;
      });
  }
}
