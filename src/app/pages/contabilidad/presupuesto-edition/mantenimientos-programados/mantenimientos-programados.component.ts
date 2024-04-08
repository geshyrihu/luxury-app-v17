import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-mantenimientos-programados',
  templateUrl: './mantenimientos-programados.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MantenimientosProgramadosComponent implements OnInit {
  customerIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  data: any[] = [];

  cuentaId: number = 0;

  ngOnInit() {
    this.cuentaId = this.config.data.cuentaId;
    if (this.cuentaId !== 0) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `Presupuesto/ServiciosMttoProgramados/${
          this.cuentaId
        }/${this.customerIdService.getcustomerId()}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }
}
