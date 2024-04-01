import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import AddPartidaCedulaComponent from 'src/app/pages/contabilidad/presupuesto/add-partida-cedula.component';
import EditPartidaCedulaComponent from 'src/app/pages/contabilidad/presupuesto/edit-partida-cedula.component';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditPeriodoCedulaPresupuestalComponent from './addoredit-periodo-cedula.component';
import OrdenesCompraCedulaComponent from './ordenes-compra-cedula/ordenes-compra-cedula.component';
@Component({
  selector: 'app-cedula-cliente',
  templateUrl: './cedula-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CedulaClienteComponent implements OnInit {
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);

  id: number = 0;
  data: any[] = [];
  listCustomer: any[] = [];
  today = new Date();
  titulo = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  presupuestoMensual: string = '';
  presupuestoEjercido: string = '';
  presupuestoDisponible: string = '';
  presupuestoAnual: string = '';
  cb_cedulas: any[] = [];

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadCedulasCustomer(this.customerIdService.customerId);
    this.customerId$.subscribe((resp) => {
      this.id = 0;
      this.onLoadData();
      this.onLoadCedulasCustomer(this.customerIdService.customerId);
    });
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `CedulaPresupuestal/GetCedulaPresupuestal/${this.customerIdService.customerId}/${this.id}`
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
        AddPartidaCedulaComponent,
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
        EditPartidaCedulaComponent,
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
        OrdenesCompraCedulaComponent,
        {
          partidaPresupuestalId,
          cedulaPresupuestalId: this.id,
        },
        'Ordenes de Compra',
        this.dialogHandlerService.dialogSizeMd
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
        AddoreditPeriodoCedulaPresupuestalComponent,
        {
          cedulaId: this.id,
        },
        'Editar Periodo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result)
          this.onLoadCedulasCustomer(this.customerIdService.customerId);
      });
  }
}
