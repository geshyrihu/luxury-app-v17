import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Creamos una instancia de la fecha actual
const dateNow = new Date();

@Injectable({
  providedIn: 'root',
})
export class PeriodoMonthService {
  // Establecemos las fechas iniciales y finales predeterminadas
  fechaInicial = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1);
  fechaFinal = new Date(dateNow.getFullYear(), dateNow.getMonth(), 0);

  // Creamos un Subject para el periodo inicial
  private periodoInicial$ = new Subject<Date>();

  // Creamos un Observable a partir del Subject para permitir la suscripción desde otros componentes
  getPeriodoInicial$(): Observable<Date> {
    return this.periodoInicial$.asObservable();
  }

  // Creamos un Subject para el periodo final
  private periodoFinal$ = new Subject<Date>();

  // Creamos un Observable a partir del Subject para permitir la suscripción desde otros componentes
  getPeriodoFinal$(): Observable<Date> {
    return this.periodoFinal$.asObservable();
  }

  // Getter para obtener la fecha de inicio del periodo
  get getPeriodoInicio(): Date {
    return this.fechaInicial;
  }

  // Getter para obtener la fecha de fin del periodo
  get getPeriodoFin(): Date {
    return this.fechaFinal;
  }

  /**
   * Establece el periodo y notifica a los observadores.
   * @param periodo Objeto que contiene el año y mes del periodo.
   */
  // setPeriodo(periodo: any) {
  //   this.fechaInicial = new Date(periodo.year, periodo.month - 1, 1);
  //   let finalTemp = new Date(periodo.year, periodo.month - 1, 1);
  //   this.fechaFinal = new Date(
  //     finalTemp.getFullYear(),
  //     finalTemp.getMonth() + 1,
  //     0
  //   );

  //   // Emitimos eventos a través de los Subjects para notificar a los observadores con las nuevas fechas del periodo.
  //   this.periodoInicial$.next(this.fechaInicial);
  //   this.periodoFinal$.next(this.fechaFinal);
  // }
  setPeriodo(periodo: string) {
    // Dividir la cadena "AAAA-MM" en año y mes.
    const [year, month] = periodo.split('-').map(Number);

    // Verificar que los valores sean válidos.
    if (
      !Number.isNaN(year) &&
      !Number.isNaN(month) &&
      month >= 1 &&
      month <= 12
    ) {
      this.fechaInicial = new Date(year, month - 1, 1);
      let finalTemp = new Date(year, month - 1, 1);
      this.fechaFinal = new Date(
        finalTemp.getFullYear(),
        finalTemp.getMonth() + 1,
        0
      );

      // Emitir eventos a través de los Subjects para notificar a los observadores con las nuevas fechas del período.
      this.periodoInicial$.next(this.fechaInicial);
      this.periodoFinal$.next(this.fechaFinal);
    } else {
      console.error('Valores de año o mes no válidos.');
    }
    // // Dividir la cadena en año y mes
    // const [year, month] = periodo.split('-');

    // // Crear la fecha inicial
    // this.fechaInicial = new Date(parseInt(year), parseInt(month) - 1, 1);

    // // Calcular la fecha final
    // const finalTemp = new Date(parseInt(year), parseInt(month) - 1, 1);
    // this.fechaFinal = new Date(
    //   finalTemp.getFullYear(),
    //   finalTemp.getMonth() + 1,
    //   0
    // );

    // // Emitir eventos a través de los Subjects para notificar a los observadores con las nuevas fechas del periodo.
    // this.periodoInicial$.next(this.fechaInicial);
    // this.periodoFinal$.next(this.fechaFinal);
  }
}
