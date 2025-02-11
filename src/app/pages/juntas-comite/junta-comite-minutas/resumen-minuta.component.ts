import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { ReportService } from 'src/app/core/services/report.service';
import ResumenMinutaGraficoComponent from './resumen-minuta-grafico.component';

@Component({
    selector: 'app-resumen-minuta',
    templateUrl: './resumen-minuta.component.html',
    imports: [LuxuryAppComponentsModule, ResumenMinutaGraficoComponent]
})
export default class ResumenMinutaComponent implements OnInit {
  reportService = inject(ReportService);
  apiRequestS = inject(ApiRequestService);
  activatedRoute = inject(ActivatedRoute);
  clipboard = inject(Clipboard);

  data: any[] = [];
  dataGrafico: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi1 = `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${this.activatedRoute.snapshot.params.meetingId}`;
    this.apiRequestS.onGetList(urlApi1).then((responseData: any) => {
      this.data = responseData;
    });

    const urlApi = `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${this.activatedRoute.snapshot.params.meetingId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.dataGrafico = responseData;
      this.reportService.setDataGrafico(responseData);
    });
  }
}
