import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import AddPartidaCedulaComponent from 'src/app/pages/contabilidad/presupuesto/add-partida-cedula.component';
import EditPartidaCedulaComponent from 'src/app/pages/contabilidad/presupuesto/edit-partida-cedula.component';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditPeriodoCedulaPresupuestalComponent from './addoredit-periodo-cedula.component';
import OrdenesCompraCedulaComponent from './ordenes-compra-cedula/ordenes-compra-cedula.component';
@Component({
  selector: 'app-cedula-cliente',
  templateUrl: './cedula-cliente.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, FormsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
  styles: [
    `
      .glass-dialog {
        background: rgba(255, 255, 255, 0.8);
      }
    `,
  ],
})
export default class CedulaClienteComponent implements OnInit, OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  subRef$: Subscription;

  id: number = 0;
  data: any[] = [];
  listCustomer: any[] = [];
  today = new Date();
  titulo = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;
  presupuestoMensual: string = '';
  presupuestoEjercido: string = '';
  presupuestoDisponible: string = '';
  presupuestoAnual: string = '';
  cb_cedulas: any[] = [];
  loading: boolean = true;

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
    this.loading = true;
    this.subRef$ = this.dataService
      .get(
        `CedulaPresupuestal/GetCedulaPresupuestal/${this.customerIdService.customerId}/${this.id}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.titulo = `Cedula presupuestal ${resp.body.periodo}`;
            this.id = resp.body.id;
            this.data = resp.body.detalle;
            this.presupuestoMensual = resp.body.cabPresupuestoMensual;
            this.presupuestoEjercido = resp.body.cabPresupuestoEjercido;
            this.presupuestoDisponible = resp.body.cabPresupuestoDisponible;
            this.presupuestoAnual = resp.body.cabPresupuestoAnual;
            //Atender.....
          } else {
            this.data = null;
          }

          this.loading = false;
        },
        error: (err) => {
          console.log(err.error);
          this.loading = false;
        },
      });
  }

  onReloadData(event: any) {
    this.id = event.target.value;
    this.onLoadData();
  }
  onLoadCedulasCustomer(customerId: number) {
    this.subRef$ = this.dataService
      .get(`CedulaPresupuestal/GetCedulas/${customerId}`)
      .subscribe({
        next: (resp: any) => {
          this.cb_cedulas = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onModalAdd(data: any) {
    this.ref = this.dialogService.open(AddPartidaCedulaComponent, {
      data: {
        idBudgetCard: this.id,
      },
      header: 'Agregar Partida',
      height: 'auto',
      width: '80%',
      styleClass: 'modal-md',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }
  onModalEditar(data: any) {
    this.ref = this.dialogService.open(EditPartidaCedulaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      height: 'auto',
      styleClass: 'modal-md',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalOrdenesCompraCedula(partidaPresupuestalId: number) {
    this.ref = this.dialogService.open(OrdenesCompraCedulaComponent, {
      data: {
        partidaPresupuestalId,
        cedulaPresupuestalId: this.id,
      },
      header: 'Ordenes de Compra',
      height: '100%',
      width: '100%',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onDelete(data: any) {
    this.subRef$ = this.dataService
      .delete(`CedulaPresupuestal/CedulaPresupuestalDetalle/${data.id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  editarPeriodo(id: number) {
    this.ref = this.dialogService.open(
      AddoreditPeriodoCedulaPresupuestalComponent,
      {
        data: {
          cedulaId: this.id,
        },
        header: 'Editar Periodo',
        height: 'auto',
        styleClass: 'modal-sm',
        baseZIndex: 10000,
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadCedulasCustomer(this.customerIdService.customerId);
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
