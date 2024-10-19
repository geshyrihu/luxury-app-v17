import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-presupuesto-detalle-edicion-historial',
  templateUrl: './presupuesto-detalle-edicion-historial.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresupuestoDetalleEdicionHistorialComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  data: any[] = [];
  id: number = 0;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(`Presupuesto/HistorialToEdition/${this.id}`)
      .then((result: any) => {
        this.data = result;
      });
  }
}
