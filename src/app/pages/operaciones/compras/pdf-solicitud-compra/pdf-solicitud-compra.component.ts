import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DataService } from 'src/app/core/services/data.service';
@Component({
  selector: 'app-pdf-solicitud-compra',
  templateUrl: './pdf-solicitud-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PdfSolicitudCompraComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public route = inject(ActivatedRoute);
  @ViewChild('htmlData') htmlData: ElementRef;
  idSolicituCompra: any;
  folioCotizacion = '';
  model: any;

  ngOnInit(): void {
    this.idSolicituCompra = this.route.snapshot.paramMap.get('id');
    this.dataService
      .get(
        `SolicitudCompra/GetSolicitudCompraIndividual/${this.idSolicituCompra}`
      )
      .subscribe((resp: any) => {
        this.folioCotizacion = resp.body.folio;
        this.model = resp.body.solicitudCompraDetalle;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
