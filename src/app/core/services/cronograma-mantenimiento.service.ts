import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CronogramaMantenimientoService {
  public data = [
    {
      value: 'externo',
      label: 'Externo',
    },
    {
      value: 'interno',
      label: 'Interno',
    },
    {
      value: 'gimnasio',
      label: 'Gimnasio',
    },
    {
      value: 'sistemas',
      label: 'Sistemas',
    },
  ];
}
