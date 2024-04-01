import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-presupuesto-detalle-edicion-historial',
  templateUrl: './presupuesto-detalle-edicion-historial.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresupuestoDetalleEdicionHistorialComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  data: any[] = [];
  id: number = 0;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .get(`Presupuesto/HistorialToEdition/${this.id}`)
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
