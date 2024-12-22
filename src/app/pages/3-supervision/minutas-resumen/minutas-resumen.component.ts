import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import FiltroMinutasAreaComponent from '../filtro-minutas-area/filtro-minutas-area.component';

@Component({
  selector: 'app-minutas-resumen',
  templateUrl: './minutas-resumen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, MultiSelectModule],
})
export default class MinutasResumenComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  periodoMonthService = inject(PeriodoMonthService);
  dateService = inject(DateService);

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
    this.apiRequestService
      .onGetList(
        `ResumenGeneral/ResumenMinutasGeneralLista/${fehcaInicio}/${fechaFinal}`
      )
      .then((result: any) => {
        this.generalMinutas = result;
      });

    this.apiRequestService
      .onGetList(
        `ResumenGeneral/ResumenMinutasGeneralGrupo/${fehcaInicio}/${fechaFinal}`
      )
      .then((result: any) => {
        this.generalMinutasGrupo = result;
      });
  }
  onModalFiltroMinutasArea(
    meetingId: number,
    area: number,
    titleEstatus: string,
    estatus: number,
    customerName: string
  ) {
    this.dialogHandlerService.openDialog(
      FiltroMinutasAreaComponent,
      {
        meetingId: meetingId,
        area: area,
        titleEstatus: titleEstatus,
        estatus: estatus,
        customerName: customerName,
      },
      '',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
