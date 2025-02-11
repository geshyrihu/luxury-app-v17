import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
  selector: 'app-presentaciones-juntas-comite',
  templateUrl: './presentaciones-juntas-comite.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresentacionesJuntasComiteComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  rangoCalendarioService = inject(FiltroCalendarService);
  route = inject(Router);
  dateS = inject(DateService);

  data: any[] = [];
  periodo: string = this.dateS.onParseToInputMonth(
    this.rangoCalendarioService.fechaInicial
  );

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    let inicial = this.dateS.getDateFormat(new Date(this.periodo + '-' + 1));
    const urlApi = 'PresentacionJuntaComite/Generales/' + inicial + '/';
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  navigateToPdf(url: string) {
    this.route.navigate(['documento/view-documento']);
  }
}
