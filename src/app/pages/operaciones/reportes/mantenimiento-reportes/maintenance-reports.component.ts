import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import MesanioComponent from 'src/app/shared/mesanio/mesanio.component';
import ResumenMantenimientosComponent from './resumen-mantenimientos/resumen-mantenimientos.component';
@Component({
  selector: 'app-maintenance-reports',
  templateUrl: './maintenance-reports.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    MesanioComponent,
    ResumenMantenimientosComponent,
    PagetitleReportComponent,
  ],
})
export default class MaintenanceReportsComponent implements OnInit {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);
  customerIdService = inject(CustomerIdService);
  menu: any;

  onFilterPeriod(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
  }
  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  ngOnInit(): void {
    this.onLoadMenu();
    this.periodoInicial$.subscribe(() => {
      this.onLoadMenu();
    });
  }
  onLoadMenu() {
    this.menu = [
      {
        name: '1.1 TICKETS',
        route: '/operaciones/reportes-mantenimiento/tickets',
      },
      {
        name: '1.2 RESUMEN DE MANTENIMIENTOS',
        route: '/operaciones/reportes-mantenimiento/resumen-mantenimientos',
      },
      {
        name: '1.3 ORDENES DE MANTENIMIENTO',
        route: '/reporte/mantenimiento-preventivo-reporte/',
      },
      {
        name: '2.1 CONSUMOS DE AGUA, GAS Y ELECTRICIDAD',
        route: '/operaciones/reportes-mantenimiento/consumos',
      },
      {
        name: '3.1 ENTRADA DE INSUMOS',
        route: '/operaciones/reportes-mantenimiento/entrada-almacen',
      },
      {
        name: '3.2 SALIDA DE INSUMOS',
        route: '/operaciones/reportes-mantenimiento/salida-almacen',
      },
      {
        name: '4.1 BITACORA DIARIA',
        route: '/operaciones/reportes-mantenimiento/recorrido-diario',
      },
      {
        name: '5.1 SOLICITUD DE INSUMOS Y SERVICIOS',
        route: '/operaciones/reportes-mantenimiento/solicitud-compra',
      },
      {
        name: '6.1 BITACORA PRESTAMO DE HERRAMIENTA',
        route: '/operaciones/reportes-mantenimiento/prestamo-herramienta',
      },
      {
        name: '7.1 BITACORA ALBERCAS',
        route: '/operaciones/reportes-mantenimiento/alberca',
      },
    ];
  }
}
