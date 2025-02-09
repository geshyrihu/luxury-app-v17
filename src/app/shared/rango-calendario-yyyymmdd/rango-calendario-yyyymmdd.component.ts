import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
const date = new Date();

@Component({
  selector: 'app-rango-calendario-yyyymmdd',
  templateUrl: './rango-calendario-yyyymmdd.component.html',
  standalone: true,
  imports: [FormsModule, FlatpickrModule],
})
export default class RangoCalendarioyyyymmddComponent implements OnInit {
  dateService = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);
  fechaInicioDate: Date = new Date(date.getFullYear(), date.getMonth(), 1); //Dia primero del mes actual
  fechaFinalDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0); //Dia Ultimo del mes Actual

  @Input()
  mostrartextDesde: boolean = true;
  @Input()
  mostrartextHasta: boolean = true;

  ngOnInit(): void {
    flatpickrFactory();
  }

  onSendDateRange(fechaInicio: any, fechaFinal: any) {
    this.rangoCalendarioService.setFechas(fechaInicio, fechaFinal);
    if (fechaInicio != null && fechaFinal != null) {
      const fechasFiltro: IFechasFiltro = {
        fechaInicio: this.dateService.getDateFormat(fechaInicio),
        fechaFinal: this.dateService.getDateFormat(fechaFinal),
      };
      this.rangoCalendarioService.fechas$.emit(fechasFiltro);
    }
  }
}
