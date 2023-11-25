import { EventEmitter, Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DateService } from './date.service';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';

// Creamos una instancia de la fecha actual
const date = new Date();

@Injectable({
  providedIn: 'root',
})
export class FiltroCalendarService {
  public dateService = inject(DateService);

  // Inicializamos las fechas de inicio y fin para el filtro de calendario
  // Día primero del mes anterior
  fechaInicial: Date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  // Día último del mes actual
  fechaFinal: Date = new Date(date.getFullYear(), date.getMonth(), 0);

  // Inicializamos las fechas de inicio y fin completas para el filtro de calendario
  fechaInicioDateFull: Date = new Date(date.getFullYear(), date.getMonth(), 1);
  fechaFinalDateFull: Date = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ); // Día último del mes actual

  // EventEmitter para emitir las fechas seleccionadas
  fechas$ = new EventEmitter<IFechasFiltro>();
  fechasMOnth$ = new EventEmitter<IFechasFiltro>();

  // Subject para emitir un arreglo de fechas
  dates$ = new Subject<Date[]>();

  /**
   * Establece las fechas de inicio y fin completas para el filtro de calendario.
   * @param fechaInicio Fecha de inicio completa.
   * @param fechaFinal Fecha de fin completa.
   */
  setFechas(fechaInicio: Date, fechaFinal: Date) {
    this.fechaInicioDateFull = fechaInicio;
    this.fechaFinalDateFull = fechaFinal;
  }

  /**
   * Establece las fechas de inicio y fin para el filtro de calendario en formato de mes.
   * @param fechaInicio Fecha de inicio en formato de mes (string).
   * @param fechaFinal Fecha de fin en formato de mes (string).
   */
  SetFechasMonth(fechaInicio: string, fechaFinal: string) {
    this.fechaInicial = new Date(fechaInicio + '-' + 1);
    let finalTemp = new Date(fechaFinal + '-' + 1);
    this.fechaFinal = new Date(
      finalTemp.getFullYear(),
      finalTemp.getMonth() + 1,
      0
    );
    // Emitimos un evento a través del Subject con las fechas seleccionadas
    this.dates$.next([this.fechaInicial, this.fechaFinal]);
  }

  /**
   * Obtiene un Observable que proporciona un arreglo de fechas.
   * @returns Observable de un arreglo de fechas.
   */
  getDates$(): Observable<Date[]> {
    return this.dates$.asObservable();
  }
}
