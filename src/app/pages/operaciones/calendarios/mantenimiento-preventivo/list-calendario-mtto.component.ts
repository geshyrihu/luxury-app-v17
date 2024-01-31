import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import CronogramaAnualMantenimientoComponent from './cronograma-anual-mantenimiento.component';
import GeneralAnualMantenimientoComponent from './general-anual-mantenimiento/general-anual-mantenimiento.component';
import ListadoAnualMantenimientoComponent from './listado-anual-mantenimiento/listado-anual-mantenimiento.component';
@Component({
  selector: 'app-index',
  templateUrl: './list-calendario-mtto.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    ListadoAnualMantenimientoComponent,
    CronogramaAnualMantenimientoComponent,
    GeneralAnualMantenimientoComponent,
    NgbNavModule,
  ],
})
export default class ListCalendarioMttoComponent {}
