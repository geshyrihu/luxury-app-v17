import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-hours-work-position',
  templateUrl: './hours-work-position.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class HoursWorkPositionComponent implements OnInit, OnDestroy {
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public ref = inject(DynamicDialogRef);
  public customToastService = inject(CustomToastService);

  data: any;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.onLoadData(this.config.data.workPositionId);
  }

  onLoadData(workPositionId: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService

      .get(`WorkPosition/GetHours/${workPositionId}`)
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
