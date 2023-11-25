import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { Subscription } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { flatpickrFactory } from '../components.module';
const date = new Date();

@Component({
  selector: 'app-rango-calendario-yyyymmdd',
  templateUrl: './rango-calendario-yyyymmdd.component.html',
  standalone: true,
  imports: [NgIf, FormsModule, FlatpickrModule],
})
export default class RangoCalendarioyyyymmddComponent
  implements OnInit, OnDestroy
{
  public dateService = inject(DateService);
  fechaInicioDate: Date = new Date(date.getFullYear(), date.getMonth(), 1); //Dia primero del mes actual
  fechaFinalDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0); //Dia Ultimo del mes Actual

  @Input()
  mostrartextDesde: boolean = true;
  @Input()
  mostrartextHasta: boolean = true;
  subRef$: Subscription;
  constructor(private rangoCalendarioService: FiltroCalendarService) {}

  ngOnInit(): void {
    /**
     * Colocar calendario en español
     */
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
