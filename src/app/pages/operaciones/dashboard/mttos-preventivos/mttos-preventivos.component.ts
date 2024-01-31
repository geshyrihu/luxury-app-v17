import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import MantenimientosPreventivosResumenComponent from '../mttos-preventivos-resumen/mttos-preventivos-resumen.component';

@Component({
  selector: 'app-mttos-preventivos',
  templateUrl: './mttos-preventivos.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    NgbAlert,
    LuxuryAppComponentsModule,
    CommonModule,
  ],
})
export default class MantenimientosPreventivosComponent
  implements OnInit, OnDestroy
{
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public periodoMonthService = inject(PeriodoMonthService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ordenesServicio: any = [];

  onChangePeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadOrdenServicio(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadOrdenServicio(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
    this.customerId$.subscribe((resp) => {
      this.onLoadOrdenServicio(
        this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        ),
        this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
      );
    });
  }

  onLoadOrdenServicio(fehcaInicio: string, getPeriodoFin: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Dashboard/OrdenesServicio/${this.customerIdService.getcustomerId()}/${fehcaInicio}/${getPeriodoFin}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.ordenesServicio = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onClick(estatus?: number) {
    this.ref = this.dialogService.open(
      MantenimientosPreventivosResumenComponent,
      {
        data: {
          estatus,
        },
        width: '100%',
        height: '100%',
        header: 'Ordenes de Mantenimiento Preventivo',
        closeOnEscape: true,
      }
    );
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
