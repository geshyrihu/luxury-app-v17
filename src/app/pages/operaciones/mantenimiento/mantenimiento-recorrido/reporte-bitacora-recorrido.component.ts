import { Component, OnInit } from '@angular/core';
import BitacoraMantenimientoComponent from '../mantenimiento-bitacoras/recorridos/bitacora-mantenimiento.component';

@Component({
  selector: 'app-reporte-bitacora-recorrido',
  templateUrl: './reporte-bitacora-recorrido.component.html',
  standalone: true,
  imports: [BitacoraMantenimientoComponent],
})
export default class ReporteBitacoraRecorridoComponent implements OnInit {
  ngOnInit() {}
}
