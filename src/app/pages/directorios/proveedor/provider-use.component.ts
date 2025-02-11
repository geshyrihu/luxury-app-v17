import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-provider-use',
    templateUrl: './provider-use.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ProviderUseComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: any[] = [];
  providerId: number = 0;

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData(this.providerId);
  }

  onLoadData(providerId: number) {
    const urlApi = `providers/coincidencias/${providerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
