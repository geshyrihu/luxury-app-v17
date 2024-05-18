import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tarjeta-producto',
  templateUrl: './tarjeta-producto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TarjetaProductoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  productoId: number = this.config.data.productoId;
  producto: any;
  urlImg: string = `${environment.base_urlImg}Administration/products/`;

  ngOnInit(): void {
    const urlApi = `Productos/${this.productoId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.producto = result;
    });
  }
}
