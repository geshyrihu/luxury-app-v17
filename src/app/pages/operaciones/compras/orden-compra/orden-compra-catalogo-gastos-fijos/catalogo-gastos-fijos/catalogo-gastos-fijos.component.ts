import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import ModalOrdenCompraGrastosFijosComponent from '../modal-orden-compra-gastos-fijos/modal-orden-compra-grastos-fijos.component';

const date = new Date();

@Component({
  selector: 'app-catalogo-gastos-fijos',
  templateUrl: './catalogo-gastos-fijos.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, FormsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class CatalogoGastosFijosComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);

  data: any = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  fechaSolicitud: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    flatpickrFactory();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.fechaSolicitud = date.toISOString().slice(0, 10);
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<any[]>(
        'CatalogoGastosFijos/GetAll/' + this.customerIdService.customerId
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
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CatalogoGastosFijos/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModal(data: any) {
    this.catalogoGastosFijosService.setCatalogoGastosFijosId(data.id);

    this.ref = this.dialogService.open(ModalOrdenCompraGrastosFijosComponent, {
      data: {
        title: data.title,
      },
      header: '',
      width: '1400px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  crearOrder(id: number, value: any) {
    this.subRef$ = this.dataService
      .get(`CatalogoGastosFijos/ValidarCreateOrder/${id}/${value}`)
      .subscribe({
        next: (resp: any) => {},
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  createOrdenesCompra() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `OrdenCompra/GenerarOrdenCompraFijos/${this.fechaSolicitud}/${this.customerIdService.customerId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
