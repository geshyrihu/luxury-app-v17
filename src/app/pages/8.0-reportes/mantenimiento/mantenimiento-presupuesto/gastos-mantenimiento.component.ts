import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/5.6-calendar/mantenimiento-preventivo/addoredit-maintenance-preventive.component';

@Component({
  selector: 'app-gastos-mantenimiento',
  templateUrl: './gastos-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [MessageService, DialogService, CustomToastService],
})
export default class GastosMantenimientoComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  dataService = inject(DataConnectorService);
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  resumenGastos: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  totalGasto: number = 0;
  ref: DynamicDialogRef;

  ngOnInit(): void {
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
        `MaintenanceCalendars/SummaryOfExpenses/${this.customerIdService.getCustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body.items;
          this.totalGasto = resp.body.totalGastos;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    this.dataService
      .get(
        `MaintenanceCalendars/Resumengastos/${this.customerIdService.getCustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.resumenGastos = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onModalItem(item: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: item.id,
          task: 'edit',
          idMachinery: item.idEquipo,
        },
        header: 'Editar regitro',
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
