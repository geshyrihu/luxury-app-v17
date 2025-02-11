import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-pdf-solicitud-compra',
  templateUrl: './pdf-solicitud-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
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
      .then((result: any) => {
        this.folioCotizacion = result.folio;
        this.model = result.solicitudCompraDetalle;
      });
  }
}
