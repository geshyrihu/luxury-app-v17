import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-cont-minuta-pendientes-pdf',
    templateUrl: './cont-minuta-pendientes-pdf.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ConMinutaPendientesPdfComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);

  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList('ContabilidadMinuta/Pendientes/0')
      .then((responseData: any) => {
        this.data = responseData;
      });
  }
}
