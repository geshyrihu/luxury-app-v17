import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';

const date = new Date();
const mesActual = date.getMonth();
const mesAnterior = new Date(date.getFullYear(), mesActual - 1, 1);
@Component({
  selector: 'app-bitacora-individual',
  templateUrl: './bitacora-individual.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class BitacoraIndividualComponent implements OnInit, OnDestroy {
  public dateService = inject(DateService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  public dialogService = inject(DialogService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  machineryId: number;
  nameMachinery: string = '';
  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinalDateFull
  );
  data: any[];

  ngOnInit(): void {
    this.machineryId = this.config.data.machineryId;
    this.nameMachinery = this.config.data.nameMachinery;
    this.onLoadData();
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
  }

  onFilter() {
    this.onLoadData();
  }

  onSendDateRange(event) {
    this.fechaFinal = event.fechaFinal;
    this.fechaInicial = event.fechaInicial;
    this.onLoadData();
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

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `BitacoraMantenimiento/BitacoraIndividual/${this.machineryId}/${this.fechaInicial}/${this.fechaFinal}`
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
