import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
    selector: 'app-calendar-range',
    templateUrl: './calendar-range.component.html',
    imports: [FormsModule, TooltipModule]
})
export default class CalendarRangeComponent {
  private filtroCalendarService = inject(FiltroCalendarService);
  dateS = inject(DateService);

  fechaInicial: string = this.dateS.onParseToInputMonth(
    this.filtroCalendarService.fechaInicial
  );
  fechaFinal: string = this.dateS.onParseToInputMonth(
    this.filtroCalendarService.fechaFinal
  );

  onSendDateRange(fechaInicial: string, fechaFinal: string) {
    this.filtroCalendarService.SetFechasMonth(fechaInicial, fechaFinal);
  }
}
