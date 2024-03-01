import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
  FiltroCalendarService,
  SistemasReporteService,
} from 'src/app/core/services/common-services';
import CardEmployeeComponent from '../../directorios/empleados/card-employee/card-employee.component';
@Component({
  selector: 'app-sistemas-reporte-pdf',
  templateUrl: './sistemas-reporte-pdf.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SistemasReportePdfComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public sistemasReporteService = inject(SistemasReporteService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);
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
