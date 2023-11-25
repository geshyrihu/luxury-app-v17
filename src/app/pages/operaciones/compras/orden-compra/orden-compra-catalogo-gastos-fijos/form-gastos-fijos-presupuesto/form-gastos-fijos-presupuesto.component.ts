import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-form-gastos-fijos-presupuesto',
  templateUrl: './form-gastos-fijos-presupuesto.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, FormsModule, PrimeNgModule],
  providers: [MessageService, CustomToastService],
})
export default class FormGastosFijosPresupuestoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public authService = inject(AuthService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  public customerIdService = inject(CustomerIdService);

  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(
        `OrdenCompraPresupuesto/GetAllForGastosFijos/${this.customerIdService.customerId}/${this.cedulaId}/${this.catalogoGastosFijosId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.onLoadPresupuestoAgregados();
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
    this.subRef$ = this.dataService
      .post(`CatalogoGastosFijosPresupuesto`, model)
      .subscribe({
        next: () => {
          this.onLoadPresupuestoAgregados();
          this.onLoadPresupuesto();
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onLoadPresupuestoAgregados() {
    this.subRef$ = this.dataService
      .get(
        `CatalogoGastosFijosPresupuesto/PresupuestoOrdenCompraFijos/${this.catalogoGastosFijosId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.presupuestoAgregados = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  deletePresupuestoAgregado(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CatalogoGastosFijosPresupuesto/${id}`)
      .subscribe({
        next: () => {
          this.onLoadPresupuesto();
          this.onLoadPresupuestoAgregados();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onUpdatePresupuestoAgregado(item: any) {
    this.subRef$ = this.dataService
      .put(`CatalogoGastosFijosPresupuesto/${item.id}`, item)
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.onLoadPresupuestoAgregados();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onLoadCedulas() {
    this.subRef$ = this.dataService
      .get(
        `CedulaPresupuestal/GetCedulas/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            this.cedulaId = resp.body[0].value;
          }
          this.cb_cedulas = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
