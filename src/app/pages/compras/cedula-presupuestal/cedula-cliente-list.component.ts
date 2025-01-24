import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import PresupuestoAddPartidaComponent from 'src/app/pages/contabilidad/presupuesto/presupuesto-add-partida.component';
import PresupuestoEditPartidaComponent from 'src/app/pages/contabilidad/presupuesto/presupuesto-edit-partida.component';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import OrdenesCompraCedulaListComponent from './ordenes-compra-cedula-list.component';
import PeriodoCedulaPresupuestalAddoreditComponent from './periodo-cedula-addoredit.component';

@Component({
  selector: 'app-cedula-cliente-list',
  templateUrl: './cedula-cliente-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CedulaClienteListComponent implements OnInit {
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);

  id: number = 0;
  data: any[] = [];
  listCustomer: any[] = [];
  today = new Date();
  titulo = '';
  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  presupuestoMensual: string = '';
  presupuestoEjercido: string = '';
  presupuestoDisponible: string = '';
  presupuestoAnual: string = '';
  cb_cedulas: any[] = [];

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.custIdService.getCustomerId$();
    this.onLoadCedulasCustomer(this.custIdService.customerId);
    this.customerId$.subscribe((resp) => {
      this.id = 0;
      this.onLoadData();
      this.onLoadCedulasCustomer(this.custIdService.customerId);
    });
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `CedulaPresupuestal/GetCedulaPresupuestal/${this.custIdService.customerId}/${this.id}`
      )
      .then((result: any) => {
        if (result !== null) {
          this.titulo = `Cedula presupuestal ${result.periodo}`;
          this.id = result.id;
          this.data = result.detalle;
          this.presupuestoMensual = result.cabPresupuestoMensual;
          this.presupuestoEjercido = result.cabPresupuestoEjercido;
          this.presupuestoDisponible = result.cabPresupuestoDisponible;
          this.presupuestoAnual = result.cabPresupuestoAnual;
        } else {
          this.data = null;
        }
      });
  }

  onReloadData(event: any) {
    this.id = event.target.value;
    this.onLoadData();
  }
  onLoadCedulasCustomer(customerId: number) {
    this.apiRequestService
      .onGetList(`CedulaPresupuestal/GetCedulas/${customerId}`)
      .then((result: any) => {
        this.cb_cedulas = result;
      });
  }
  onModalAdd() {
    this.dialogHandlerService
      .openDialog(
        PresupuestoAddPartidaComponent,
        {
          idBudgetCard: this.id,
        },
        'Agregar Partida',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalEditar(data: any) {
    this.dialogHandlerService
      .openDialog(
        PresupuestoEditPartidaComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalOrdenesCompraCedula(partidaPresupuestalId: number) {
    this.dialogHandlerService
      .openDialog(
        OrdenesCompraCedulaListComponent,
        {
          partidaPresupuestalId,
          cedulaPresupuestalId: this.id,
        },
        'Ordenes de Compra',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`CedulaPresupuestalDetalle/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  editarPeriodo() {
    this.dialogHandlerService
      .openDialog(
        PeriodoCedulaPresupuestalAddoreditComponent,
        {
          cedulaId: this.id,
        },
        'Editar Periodo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadCedulasCustomer(this.custIdService.customerId);
      });
  }
}
