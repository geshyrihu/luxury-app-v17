import { EventEmitter, Injectable } from '@angular/core';
import { IFechasFiltro } from '../interfaces/IFechasFiltro.interface';

// Creamos una instancia de fecha actual
const date = new Date();

@Injectable({
  providedIn: 'root',
})
export class RangoCalendarioCompletoService {
  // Al cargar el servicio, se cargan las fechas del Mes Actual
  fechaInicioDate: Date = new Date(date.getFullYear(), date.getMonth() - 1, 1); // Primer día del mes anterior
  fechaFinalDate: Date = new Date(date.getFullYear(), date.getMonth(), 0); // Último día del mes actual

  // Creamos un EventEmitter para emitir las fechas seleccionadas
  fechas$ = new EventEmitter<IFechasFiltro>();

  /**
   * Establece las fechas de inicio y final para el rango de calendario.
   * @param fechaInicio Fecha de inicio del rango.
   * @param fechaFinal Fecha final del rango.
   */
  setFechas(fechaInicio: Date, fechaFinal: Date) {
    this.fechaInicioDate = fechaInicio;
    this.fechaFinalDate = fechaFinal;
  }
}
