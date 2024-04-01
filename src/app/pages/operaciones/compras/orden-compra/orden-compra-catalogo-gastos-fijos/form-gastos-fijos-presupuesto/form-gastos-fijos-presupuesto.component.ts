import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
@Component({
  selector: 'app-form-gastos-fijos-presupuesto',
  templateUrl: './form-gastos-fijos-presupuesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormGastosFijosPresupuestoComponent
  implements OnInit, OnDestroy
{
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  public customerIdService = inject(CustomerIdService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `OrdenCompraPresupuesto/GetAllForGastosFijos/${this.customerIdService.customerId}/${this.cedulaId}/${this.catalogoGastosFijosId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.onLoadPresupuestoAgregados();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit(partidaPresupuestal: any) {
    const model = {
      cedulaPresupuestalDetalleId:
        partidaPresupuestal.cedulaPresupuestalDetalleId,
      dineroUsado: partidaPresupuestal.dineroUsado,
      catalogoGastosFijosId: this.catalogoGastosFijosId,
    };
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post(`CatalogoGastosFijosPresupuesto`, model)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadPresupuestoAgregados();
          this.onLoadPresupuesto();
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadPresupuestoAgregados() {
    this.dataService
      .get(
        `CatalogoGastosFijosPresupuesto/PresupuestoOrdenCompraFijos/${this.catalogoGastosFijosId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.presupuestoAgregados = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  deletePresupuestoAgregado(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`CatalogoGastosFijosPresupuesto/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadPresupuesto();
          this.onLoadPresupuestoAgregados();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onUpdatePresupuestoAgregado(item: any) {
    this.dataService
      .put(`CatalogoGastosFijosPresupuesto/${item.id}`, item)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.onLoadPresupuestoAgregados();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadCedulas() {
    this.dataService
      .get(
        `CedulaPresupuestal/GetCedulas/${this.customerIdService.getcustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            this.cedulaId = resp.body[0].value;
          }
          this.cb_cedulas = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
