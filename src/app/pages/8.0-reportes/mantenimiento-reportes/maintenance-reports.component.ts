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
import { MenuReportMaintenance } from './menu-report-maintenance';
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
  periodoMonthService = inject(PeriodoMonthService);
  customerIdService = inject(CustomerIdService);
  menu: any;
  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  private storageKey = 'selectedPeriodo';
  periodo: string;

  ngOnInit(): void {
    const savedPeriodo = localStorage.getItem(this.storageKey);
    if (savedPeriodo) {
      this.periodo = savedPeriodo;
      this.onFilterPeriod(savedPeriodo);
    }

    this.onLoadMenu();

    this.periodoInicial$.subscribe(() => {
      this.onLoadMenu();
    });
  }
  onFilterPeriod(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    localStorage.setItem(this.storageKey, periodo);
  }

  onLoadMenu() {
    this.menu = MenuReportMaintenance;
  }
}
