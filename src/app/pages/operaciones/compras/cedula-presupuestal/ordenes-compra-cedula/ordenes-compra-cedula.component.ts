import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
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
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';

import OrdenCompraComponent from '../../orden-compra/orden-compra/orden-compra.component';

@Component({
  selector: 'app-ordenes-compra-cedula',
  templateUrl: './ordenes-compra-cedula.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CommonModule, NgbTooltip],
})
export default class OrdenesCompraCedulaComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  apiRequestService = inject(ApiRequestService);
  dataService = inject(DataService);
  config = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public ordenCompraService = inject(OrdenCompraService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `OrdenCompra/compraspresupuesto/${this.partidaPresupuestalId}/${this.cedulaPresupuestalId}`
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
      // Puedes ajustar las opciones regionales aquí
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
      // Puedes ajustar las opciones regionales aquí
    });
  }
  ref: DynamicDialogRef;
  onOrdenCompraModal(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);
    this.ref = this.dialogService.open(OrdenCompraComponent, {
      data: {
        id,
      },
      header: 'Editar Orden de Compra',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
