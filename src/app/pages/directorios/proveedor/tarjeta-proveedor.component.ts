import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-tarjeta-proveedor',
    templateUrl: './tarjeta-proveedor.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class TarjetaProveedorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
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
    this.apiRequestS
      .onGetItem(`Proveedor/${this.providerId}`)
      .then((responseData: any) => {
        this.urlLogo = responseData.pathPhoto;
        this.model = responseData;
      });
  }
}
