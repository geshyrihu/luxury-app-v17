import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-mantenimientos-programados',
  templateUrl: './mantenimientos-programados.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MantenimientosProgramadosComponent
  implements OnInit, OnDestroy
{
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  data: any[] = [];

  cuentaId: number = 0;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.cuentaId = this.config.data.cuentaId;
    if (this.cuentaId !== 0) this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .get(
        `Presupuesto/ServiciosMttoProgramados/${
          this.cuentaId
        }/${this.customerIdService.getcustomerId()}`
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
