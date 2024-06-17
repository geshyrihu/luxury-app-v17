import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import CardEmployeeComponent from 'src/app/pages/employee/card-employee/card-employee.component';

@Component({
  selector: 'app-bitacora-individual',
  templateUrl: './bitacora-individual.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class BitacoraIndividualComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  dateService = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

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
  onCardEmployee(applicationUserId: number) {
    this.dialogHandlerService
      .openDialog(
        CardEmployeeComponent,
        {
          applicationUserId,
        },
        'Tarjeta de Usuario',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onLoadData() {
    const urlApi = `BitacoraMantenimiento/BitacoraIndividual/${this.machineryId}/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
