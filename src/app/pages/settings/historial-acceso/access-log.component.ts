import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AccessLogComponent implements OnInit {
  dateService = inject(DateService);
  custIdService = inject(CustomerIdService);
  filtroCalendarService = inject(FiltroCalendarService);

  apiRequestService = inject(ApiRequestService);

  data: any[] = [];

  customerId$: Observable<number> = this.custIdService.getCustomerId$();
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
    const urlApi = `AccessHistory/${this.custIdService.customerId}/${fechaInicial}/${fechaFinal}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
