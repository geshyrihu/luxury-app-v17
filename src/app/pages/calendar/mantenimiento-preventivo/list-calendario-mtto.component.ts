import { Component, Input } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import GeneralAnualMantenimientoComponent from '../general-anual-mantenimiento/general-anual-mantenimiento.component';
import ListadoAnualMantenimientoComponent from '../listado-anual-mantenimiento/listado-anual-mantenimiento.component';
import CronogramaAnualMantenimientoComponent from './cronograma-anual-mantenimiento.component';

@Component({
    selector: 'app-index',
    templateUrl: './list-calendario-mtto.component.html',
    imports: [
        LuxuryAppComponentsModule,
        ListadoAnualMantenimientoComponent,
        CronogramaAnualMantenimientoComponent,
        GeneralAnualMantenimientoComponent,
        NgbNavModule,
    ]
})
export default class ListCalendarioMttoComponent {
  @Input() tipoCalendario: string = 'preventivo de equipos';

  // Función que recibe el mensaje y lo guarda en la variable `message`
  receiveMessage(message: string) {
    this.tipoCalendario = message;
  }
}
