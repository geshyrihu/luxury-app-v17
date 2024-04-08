import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { ReportService } from 'src/app/core/services/report.service';
import ResumenMinutaGraficoComponent from '../resumen-minuta-grafico/resumen-minuta-grafico.component';

@Component({
  selector: 'app-resumen-minuta',
  templateUrl: './resumen-minuta.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ResumenMinutaGraficoComponent],
})
export default class ResumenMinutaComponent implements OnInit {
  reportService = inject(ReportService);
  apiRequestService = inject(ApiRequestService);
  activatedRoute = inject(ActivatedRoute);
  clipboard = inject(Clipboard);

  data: any[] = [];
  dataGrafico: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi1 = `MeetingDertailsSeguimiento/ResumenMinutasPresentacion/${this.activatedRoute.snapshot.params.meetingId}`;
    this.apiRequestService.onGetList(urlApi1).then((result: any) => {
      this.data = result;
    });

    const urlApi = `MeetingDertailsSeguimiento/ResumenMinutasGraficoPresentacion/${this.activatedRoute.snapshot.params.meetingId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.dataGrafico = result;
      this.reportService.setDataGrafico(result);
    });
  }
}
