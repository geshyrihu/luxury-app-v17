import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import CrudEntregaRecepcionClienteComponent from '../addoredit-entrega-recepcion-cliente/addoredit-entrega-recepcion-cliente.component';

@Component({
  selector: 'app-entrega-recepcion-cliente',
  templateUrl: './entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class EntregaRecepcionClienteComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  // public viewPdfService = inject(ViewPdfService);

  public route = inject(Router);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  cb_departamento = [
    { value: 'JURIDICO' },
    { value: 'ADMINISTRACIÓN Y FINANZAS' },
    { value: 'OPERACIONES Y MANTENIMIENTO' },
  ];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  departamento = this.cb_departamento[0].value;

  onValidarCargo() {
    if (this.authService.onValidateRoles(['Contador']))
      this.departamento = this.cb_departamento[1].value;
    if (this.authService.onValidateRoles(['Legal']))
      this.departamento = this.cb_departamento[0].value;
    if (this.authService.onValidateRoles(['Operaciones']))
      this.departamento = this.cb_departamento[2].value;
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onValidarCargo();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onChangeDepartamento(departamento: string) {
    this.departamento = departamento;
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    // * Peticion para generar los items de entrega recepcion
    this.subRef$ = this.dataService
      .get('EntregaRecepcionCliente/GenerateData')
      .subscribe({
        next: (resp: any) => {},
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
    // * Peticion para generar los items de entrega recepcion
    this.subRef$ = this.dataService
      .get(
        'EntregaRecepcionCliente/' +
          this.customerIdService.customerId +
          '/' +
          this.departamento
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

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(CrudEntregaRecepcionClienteComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
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
  navigateToPdf(url: string) {
    const urlFinal =
      'customers/' +
      this.customerIdService.getcustomerId() +
      '/entregarecepcion/' +
      url;
    // this.viewPdfService.setNameDocument(urlFinal);
    this.route.navigate(['documento/view-documento']);
  }

  onValidarDocument(id: number) {
    this.subRef$ = this.dataService
      .put(
        `EntregaRecepcionCliente/ValidarArchivo/${this.authService.userTokenDto.infoEmployeeDto.employeeId}/${id}`,
        null
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onInvalidarDocument(id: number) {
    this.subRef$ = this.dataService
      .put(`EntregaRecepcionCliente/InvalidarArchivo/${id}`, null)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onDeleteFile(id: number) {
    this.subRef$ = this.dataService
      .delete(`EntregaRecepcionCliente/DeleteFile/${id}`)
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
