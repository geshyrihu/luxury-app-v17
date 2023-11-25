import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterRequestsService {
  // Inicializamos la fecha de inicio al 1 de enero del año actual
  fechaInicial = new Date(new Date().getFullYear(), 0, 1);

  // Formateamos la fecha inicial en formato ISO (AAAA-MM) para usarla en la solicitud
  fechaFormateada = this.fechaInicial.toISOString().slice(0, 7);

  // Subject para emitir los parámetros de la solicitud HTTP
  private paramsEmit$: Subject<HttpParams> = new Subject<HttpParams>();

  // Estado inicial de las solicitudes
  statusRequest: string = 'Pendiente';

  // Parámetros iniciales
  private params: HttpParams = new HttpParams();

  constructor() {
    // Configuramos los parámetros iniciales
    this.setInitialParams();
  }

  /**
   * Configura los parámetros iniciales de la solicitud HTTP.
   */
  setInitialParams() {
    this.params = this.params
      .set('dateRequest', this.fechaFormateada)
      .set('status', this.statusRequest);
  }

  /**
   * Establece los parámetros de la solicitud HTTP con la fecha y estado especificados.
   * @param date Fecha en formato 'AAAA-MM'.
   * @param status Estado de las solicitudes.
   */
  setParams(date: any, status: any) {
    this.fechaInicial = new Date(`${date}-01T00:00:00`);
    let fechaISO = this.fechaInicial.toISOString().slice(0, 10);

    // Creamos una nueva instancia de HttpParams con los parámetros actualizados
    let newParams = new HttpParams()
      .set('dateRequest', fechaISO)
      .set('status', status);

    // Asignamos la nueva instancia de HttpParams al campo params
    this.params = newParams;

    // Emitimos los nuevos parámetros a través del Subject
    this.paramsEmit$.next(this.params);
  }

  /**
   * Obtiene un Observable que proporciona los parámetros de la solicitud HTTP.
   * @returns Observable de los parámetros de la solicitud HTTP.
   */
  getParams$(): Observable<HttpParams> {
    return this.paramsEmit$.asObservable();
  }

  /**
   * Obtiene los parámetros de la solicitud HTTP.
   * @returns Parámetros de la solicitud HTTP.
   */
  getParams() {
    return this.params;
  }
}
