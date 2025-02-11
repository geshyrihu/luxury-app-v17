import { Component, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import BitacoraMantenimientoComponent from '../recorrido-mantenimiento/bitacora-mantenimiento.component';

@Component({
    selector: 'app-reporte-bitacora-recorrido',
    templateUrl: './reporte-bitacora-recorrido.component.html',
    imports: [LuxuryAppComponentsModule, BitacoraMantenimientoComponent]
})
export default class ReporteBitacoraRecorridoComponent implements OnInit {
  ngOnInit() {}
}
