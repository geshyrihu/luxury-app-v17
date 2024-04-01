import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { SistemasReporteService } from 'src/app/core/services/sistemas-reporte.service';
import CardEmployeeComponent from '../../directorios/empleados/card-employee/card-employee.component';
@Component({
  selector: 'app-sistemas-reporte-pdf',
  templateUrl: './sistemas-reporte-pdf.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SistemasReportePdfComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  public sistemasReporteService = inject(SistemasReporteService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  public dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  datosUser: any;

  ref: DynamicDialogRef;

  fechaInicioDate = this.rangoCalendarioService.fechaInicial;
  fechaFinalDate = this.rangoCalendarioService.fechaFinal;

  ngOnInit() {
    this.data = this.sistemasReporteService.dataReport;
    this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(
        'Sistemas/GetUserData/' +
          this.authService.userTokenDto.infoUserAuthDto.applicationUserId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.datosUser = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Tarjeta de Usuario',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
