import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import DashboardTicketsResumenComponent from '../dashboard-tickets-resumen/dashboard-tickets-resumen.component';
@Component({
  selector: 'app-dashboard-tickets',
  templateUrl: './dashboard-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DashboardTicketsComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        'Dashboard/TicketPendientes/' + this.customerIdService.getcustomerId()
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
  onLoadResumen(responsibleAreaId: number) {
    this.ref = this.dialogService.open(DashboardTicketsResumenComponent, {
      data: {
        responsibleAreaId,
      },
      header: 'Pendientes',

      height: '100%',
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
