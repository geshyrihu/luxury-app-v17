import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-tarjeta-producto',
  templateUrl: './tarjeta-producto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TarjetaProductoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  productoId: number = this.config.data.productoId;
  producto: any;

  ngOnInit(): void {
    const urlApi = `Productos/${this.productoId}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.producto = result;
    });
  }
}
