import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';
import OrdenCompraComponent from '../orden-compra/orden-compra/orden-compra.component';

@Component({
    selector: 'app-ordenes-compra-cedula-list',
    templateUrl: './ordenes-compra-cedula-list.component.html',
    imports: [LuxuryAppComponentsModule, CommonModule, NgbTooltip]
})
export default class OrdenesCompraCedulaListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  ordenCompraService = inject(OrdenCompraService);

  partidaPresupuestalId: number = 0;
  cedulaPresupuestalId: number = 0;
  data: any[] = [];
  ngOnInit(): void {
    this.partidaPresupuestalId = this.config.data.partidaPresupuestalId;
    this.cedulaPresupuestalId = this.config.data.cedulaPresupuestalId;
    if (this.partidaPresupuestalId !== 0 && this.cedulaPresupuestalId !== 0)
      this.onLoadData();
  }

  onLoadData() {
    const urlApi = `OrdenCompra/compraspresupuesto/${this.partidaPresupuestalId}/${this.cedulaPresupuestalId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  pagadas() {
    let total: number = 0;
    this.data.forEach((item) => {
      if (item.statuspagoFiltro) {
        total += item.totalSuma;
      }
    });

    return total.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }
  noPagadas() {
    let total: number = 0;
    this.data.forEach((item) => {
      if (!item.statuspagoFiltro) {
        total += item.totalSuma;
      }
    });

    return total.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  }
  ref: DynamicDialogRef;
  onOrdenCompraModal(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS.openDialog(
      OrdenCompraComponent,
      {
        id,
      },
      'Editar Orden de Compra',
      this.dialogHandlerS.dialogSizeMd
    );
  }
}
