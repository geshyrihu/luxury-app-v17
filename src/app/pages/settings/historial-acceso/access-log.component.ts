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
  dateS = inject(DateService);
  customerIdS = inject(CustomerIdService);
  filtroCalendarService = inject(FiltroCalendarService);

  apiRequestS = inject(ApiRequestService);

  data: any[] = [];

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  dates$: Observable<Date[]> = this.filtroCalendarService.getDates$();

  ngOnInit(): void {
    this.onLoadData(
      this.dateS.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateS.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
    this.customerId$.subscribe(() => {
      this.onLoadData(
        this.dateS.getDateFormat(this.filtroCalendarService.fechaInicial),
        this.dateS.getDateFormat(this.filtroCalendarService.fechaFinal)
      );
    });
    this.dates$.subscribe((dates) => {
      this.onLoadData(
        this.dateS.getDateFormat(dates[0]),
        this.dateS.getDateFormat(dates[1])
      );
    });
  }

  onLoadData(fechaInicial: string, fechaFinal: string): void {
    const urlApi = `AccessHistory/${this.customerIdS.customerId}/${fechaInicial}/${fechaFinal}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
