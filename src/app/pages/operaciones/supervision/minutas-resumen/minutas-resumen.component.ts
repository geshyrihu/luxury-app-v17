import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
import FiltroMinutasAreaComponent from '../filtro-minutas-area/filtro-minutas-area.component';
@Component({
  selector: 'app-minutas-resumen',
  templateUrl: './minutas-resumen.component.html',
  providers: [DialogService, MessageService, CustomToastService],
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    TableModule,
    MultiSelectModule,
  ],
})
export default class MinutasResumenComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public periodoMonthService = inject(PeriodoMonthService);
  public selectItemService = inject(SelectItemService);
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
    this.selectItemService.getCustomersNombreCorto().subscribe((resp) => {
      this.cb_customers = resp;
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
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ResumenMinutasGeneralLista/${fehcaInicio}/${fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
          this.generalMinutas = resp.body;
          this.customToastService.onClose();
        },

        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ResumenMinutasGeneralGrupo/${fehcaInicio}/${fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
          this.generalMinutasGrupo = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
