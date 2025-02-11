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
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  data: any[] = [];

  cuentaId: number = 0;

  ngOnInit() {
    this.cuentaId = this.config.data.cuentaId;
    if (this.cuentaId !== 0) this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        `Presupuesto/ServiciosMttoProgramados/${
          this.cuentaId
        }/${this.customerIdS.getCustomerId()}`
      )
      .then((responseData: any) => {
        this.data = responseData;
      });
  }
}
