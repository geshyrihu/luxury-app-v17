import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import ServiceOrderAddOrEditComponent from '../../../mantenimiento-ordenes-servicio/addoredit-service-order.component';

@Component({
  selector: 'app-service-history-machinery',
  templateUrl: './service-history-machinery.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ServiceHistoryMachineryComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  id: number = this.config.data.id;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`Machineries/ServiceHistory/${this.config.data.id}`)
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

  onEdit(data: any) {
    this.ref = this.dialogService.open(ServiceOrderAddOrEditComponent, {
      data: {
        id: data.id,
        machineryId: data.machineryId,
        providerId: data.providerId,
      },
      header: data.title,
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
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
