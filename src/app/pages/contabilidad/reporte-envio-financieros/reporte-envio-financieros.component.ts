import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-reporte-envio-financieros',
  templateUrl: './reporte-envio-financieros.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteEnvioFinancierosComponent implements OnInit {
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public periodoMonthService = inject(PeriodoMonthService);
  public dateService = inject(DateService);

  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  periodo: string = '';

  ngOnInit(): void {
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadData();
  }

  // Función para cargar los datos de los reporte
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de reporte
    this.dataService
      .get(
        `estadofinanciero/reporteenviomensual/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadData();
  }

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
