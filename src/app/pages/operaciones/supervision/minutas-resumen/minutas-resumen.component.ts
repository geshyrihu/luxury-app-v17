import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import FiltroMinutasAreaComponent from '../filtro-minutas-area/filtro-minutas-area.component';
@Component({
  selector: 'app-minutas-resumen',
  templateUrl: './minutas-resumen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, MultiSelectModule],
})
export default class MinutasResumenComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public periodoMonthService = inject(PeriodoMonthService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ref: DynamicDialogRef;
  cb_customers: any[] = [];
  generalMinutas: any[] = [];
  generalMinutasGrupo: any[] = [];
  generalMinutasView: boolean = false;
  generalMinutasGrupoView: boolean = true;
  periodo: string = '';

  ngOnInit(): void {
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.apiRequestService
      .onGetSelectItem(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers = response.map((selectList: any) => ({
          label: selectList.label,
        }));
      });

    this.onLoadData(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadData(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );

    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
  }

  onLoadData(fehcaInicio: string, fechaFinal: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ResumenMinutasGeneralLista/${fehcaInicio}/${fechaFinal}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.generalMinutas = resp.body;
          this.customToastService.onClose();
        },

        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    this.dataService
      .get(
        `ResumenGeneral/ResumenMinutasGeneralGrupo/${fehcaInicio}/${fechaFinal}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.generalMinutasGrupo = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onModalFiltroMinutasArea(
    meetingId: number,
    area: number,
    titleEstatus: string,
    estatus: number,
    customerName: string
  ) {
    this.ref = this.dialogService.open(FiltroMinutasAreaComponent, {
      data: {
        meetingId,
        area,
        titleEstatus,
        estatus,
        customerName,
      },
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
      styleClass: 'customFullModal',
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
