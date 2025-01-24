import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-tarjeta-proveedor',
  templateUrl: './tarjeta-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TarjetaProveedorComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  model: any;
  providerId: number;
  urlLogo = '';

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    if (this.providerId !== null) {
      this.onLoadItem();
    }
  }
  onLoadItem() {
    this.apiRequestService
      .onGetItem(`Proveedor/${this.providerId}`)
      .then((result: any) => {
        this.urlLogo = result.pathPhoto;
        this.model = result;
      });
  }
}
