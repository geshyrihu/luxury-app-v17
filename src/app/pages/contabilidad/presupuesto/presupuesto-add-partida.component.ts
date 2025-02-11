import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CedulaPresupuestalDetalleAddOrEdit } from 'src/app/core/class/cedula-presupuestal-detalle-add-or-edit.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-presupuesto-add-partida',
  templateUrl: './presupuesto-add-partida.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PresupuestoAddPartidaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);

  data: any[] = [];
  cedulaPresupuestalId: number = 0;
  submitting: boolean = false;

  ngOnInit(): void {
    this.cedulaPresupuestalId = this.config.data.idBudgetCard;
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS
      .onGetList(
        `SelectItem/AddCuentaCedulaPresupuestal/${this.config.data.idBudgetCard}`
      )
      .then((result: any) => {
        this.data = result.map(function (cuenta: any) {
          return {
            id: cuenta.id,
            numeroCuenta: cuenta.numeroCuenta,
            descripcion: cuenta.descripcion,
            presupuestoMensual: 0,
          };
        });
      });
  }
  onSubmit(item: any) {
    let model: CedulaPresupuestalDetalleAddOrEdit =
      new CedulaPresupuestalDetalleAddOrEdit();

    model.cuentaId = item.id;
    model.cedulaPresupuestalId = this.cedulaPresupuestalId;
    model.presupuestoMensual = item.presupuestoMensual;
    model.presupuestoEjercido = 0;
    model.applicationUserId = this.authS.applicationUserId;

    this.submitting = true;

    this.apiRequestS.onPost(`CedulaPresupuestalDetalles`, model).then(() => {
      this.onLoadData();
    });
  }
}
