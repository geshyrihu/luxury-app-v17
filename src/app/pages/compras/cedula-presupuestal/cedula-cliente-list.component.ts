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
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);

  id: number = 0;
  data: any[] = [];
  listCustomer: any[] = [];
  today = new Date();
  titulo = '';
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  presupuestoMensual: string = '';
  presupuestoEjercido: string = '';
  presupuestoDisponible: string = '';
  presupuestoAnual: string = '';
  cb_cedulas: any[] = [];

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.onLoadCedulasCustomer(this.customerIdS.customerId);
    this.customerId$.subscribe((resp) => {
      this.id = 0;
      this.onLoadData();
      this.onLoadCedulasCustomer(this.customerIdS.customerId);
    });
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        `CedulaPresupuestal/GetCedulaPresupuestal/${this.customerIdS.customerId}/${this.id}`
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
    this.apiRequestS
      .onGetList(`CedulaPresupuestal/GetCedulas/${customerId}`)
      .then((result: any) => {
        this.cb_cedulas = result;
      });
  }
  onModalAdd() {
    this.dialogHandlerS
      .openDialog(
        PresupuestoAddPartidaComponent,
        {
          idBudgetCard: this.id,
        },
        'Agregar Partida',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalEditar(data: any) {
    this.dialogHandlerS
      .openDialog(
        PresupuestoEditPartidaComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalOrdenesCompraCedula(partidaPresupuestalId: number) {
    this.dialogHandlerS
      .openDialog(
        OrdenesCompraCedulaListComponent,
        {
          partidaPresupuestalId,
          cedulaPresupuestalId: this.id,
        },
        'Ordenes de Compra',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`CedulaPresupuestalDetalle/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  editarPeriodo() {
    this.dialogHandlerS
      .openDialog(
        PeriodoCedulaPresupuestalAddoreditComponent,
        {
          cedulaId: this.id,
        },
        'Editar Periodo',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadCedulasCustomer(this.customerIdS.customerId);
      });
  }
}
