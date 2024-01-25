import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-dashboard-tickets-resumen',
  templateUrl: './dashboard-tickets-resumen.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
  providers: [CustomToastService],
})
export default class DashboardTicketsResumenComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);

  data: any[] = [];
  responsibleAreaId: number = 0;
  subRef$: Subscription;

  ngOnInit(): void {
    this.responsibleAreaId = this.config.data.responsibleAreaId;
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/TicketPendientesResumen/${this.customerIdService.customerId}/${this.responsibleAreaId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
