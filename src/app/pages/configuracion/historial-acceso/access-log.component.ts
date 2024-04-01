import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AccessLogComponent implements OnInit {
  public dateService = inject(DateService);
  public customerIdService = inject(CustomerIdService);
  private filtroCalendarService = inject(FiltroCalendarService);

  apiRequestService = inject(ApiRequestService);

  urlImgApi = environment.base_urlImg + 'Administration/accounts/';
  data: any[] = [];

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  dates$: Observable<Date[]> = this.filtroCalendarService.getDates$();

  ngOnInit(): void {
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
    this.customerId$.subscribe(() => {
      this.onLoadData(
        this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
        this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
      );
    });
    this.dates$.subscribe((dates) => {
      this.onLoadData(
        this.dateService.getDateFormat(dates[0]),
        this.dateService.getDateFormat(dates[1])
      );
    });
  }

  onLoadData(fechaInicial: string, fechaFinal: string): void {
    this.apiRequestService
      .onGetList(
        'HistorialAcceso/Customer/' +
          this.customerIdService.customerId +
          '/' +
          fechaInicial +
          '/' +
          fechaFinal
      )
      .then((result: any) => {
        this.data = result;
      });
  }
}
