import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-cont-minuta-pendientes-pdf',
  templateUrl: './cont-minuta-pendientes-pdf.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ConMinutaPendientesPdfComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);

  data: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList('ContabilidadMinuta/Pendientes/0')
      .then((result: any) => {
        this.data = result;
      });
  }
}
