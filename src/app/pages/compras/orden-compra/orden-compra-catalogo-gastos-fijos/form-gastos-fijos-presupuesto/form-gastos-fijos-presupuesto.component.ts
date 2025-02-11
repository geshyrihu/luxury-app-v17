import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-form-gastos-fijos-presupuesto',
  templateUrl: './form-gastos-fijos-presupuesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormGastosFijosPresupuestoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];
  presupuestoAgregados: any[] = [];
  total: number = 0;
  catalogoGastosFijosId: number = 0;
  cb_cedulas: any[] = [];
  cedulaId: number = 0;

  ngOnInit(): void {
    this.onLoadCedulas();
    this.catalogoGastosFijosId =
      this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    this.onLoadPresupuesto();
  }

  onLoadPresupuesto() {
    const urlApi = `OrdenCompraPresupuesto/GetAllForGastosFijos/${this.customerIdS.customerId}/${this.cedulaId}/${this.catalogoGastosFijosId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onLoadPresupuestoAgregados();
    });
  }

  onSubmit(partidaPresupuestal: any) {
    const model = {
      cedulaPresupuestalDetalleId:
        partidaPresupuestal.cedulaPresupuestalDetalleId,
      dineroUsado: partidaPresupuestal.dineroUsado,
      catalogoGastosFijosId: this.catalogoGastosFijosId,
    };

    this.apiRequestS
      .onPost(`CatalogoGastosFijosPresupuesto`, model)
      .then((result: boolean) => {
        this.onLoadPresupuestoAgregados();
        this.onLoadPresupuesto();
      });
  }

  onLoadPresupuestoAgregados() {
    const urlApi = `CatalogoGastosFijosPresupuesto/PresupuestoOrdenCompraFijos/${this.catalogoGastosFijosId}`;

    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.presupuestoAgregados = result;
    });
  }

  deletePresupuestoAgregado(id: number) {
    this.apiRequestS
      .onDelete(`CatalogoGastosFijosPresupuesto/${id}`)
      .then((result: boolean) => {
        this.onLoadPresupuesto();
        this.onLoadPresupuestoAgregados();
      });
  }

  onUpdatePresupuestoAgregado(item: any) {
    this.apiRequestS
      .onPut(`CatalogoGastosFijosPresupuesto/${item.id}`, item)
      .then((result: boolean) => {
        this.onLoadPresupuestoAgregados();
      });
  }

  onLoadCedulas() {
    const urlApi = `CedulaPresupuestal/GetCedulas/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.cedulaId = result[0].value;
      }
      this.cb_cedulas = result;
    });
  }
}
