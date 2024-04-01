import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-dashboard-tickets-resumen',
  templateUrl: './dashboard-tickets-resumen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DashboardTicketsResumenComponent
  implements OnInit, OnDestroy
{
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);

  data: any[] = [];
  responsibleAreaId: number = 0;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.responsibleAreaId = this.config.data.responsibleAreaId;
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Dashboard/TicketPendientesResumen/${this.customerIdService.customerId}/${this.responsibleAreaId}`
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
