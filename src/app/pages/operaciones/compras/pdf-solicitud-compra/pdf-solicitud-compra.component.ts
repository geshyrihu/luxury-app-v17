import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-pdf-solicitud-compra',
  templateUrl: './pdf-solicitud-compra.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule],
})
export default class PdfSolicitudCompraComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public route = inject(ActivatedRoute);
  @ViewChild('htmlData') htmlData: ElementRef;
  idSolicituCompra: any;
  folioCotizacion = '';
  model: any;
  subRef$: Subscription;

  ngOnInit(): void {
    this.idSolicituCompra = this.route.snapshot.paramMap.get('id');
    this.subRef$ = this.dataService
      .get(
        `SolicitudCompra/GetSolicitudCompraIndividual/${this.idSolicituCompra}`
      )
      .subscribe((resp: any) => {
        this.folioCotizacion = resp.body.folio;
        this.model = resp.body.solicitudCompraDetalle;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
