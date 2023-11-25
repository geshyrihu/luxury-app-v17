import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import OrdenCompraComponent from '../../orden-compra/orden-compra/orden-compra.component';

@Component({
  selector: 'app-ordenes-compra-cedula',
  templateUrl: './ordenes-compra-cedula.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule, NgbTooltip],
  providers: [CustomToastService],
})
export default class OrdenesCompraCedulaComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public ordenCompraService = inject(OrdenCompraService);

  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get(
        `OrdenCompra/compraspresupuesto/${this.partidaPresupuestalId}/${this.cedulaPresupuestalId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
