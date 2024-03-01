import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';

import CrudEntregaRecepcionClienteComponent from '../addoredit-entrega-recepcion-cliente/addoredit-entrega-recepcion-cliente.component';

@Component({
  selector: 'app-entrega-recepcion-cliente',
  templateUrl: './entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EntregaRecepcionClienteComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
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

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.dataService
      .get('EntregaRecepcionCliente/GenerateData')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {},
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    // * Peticion para generar los items de entrega recepcion
    this.dataService
      .get(
        'EntregaRecepcionCliente/' +
          this.customerIdService.customerId +
          '/' +
          this.departamento
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
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
    this.dataService
      .put(
        `EntregaRecepcionCliente/ValidarArchivo/${this.authService.userTokenDto.infoEmployeeDto.employeeId}/${id}`,
        null
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onInvalidarDocument(id: number) {
    this.dataService
      .put(`EntregaRecepcionCliente/InvalidarArchivo/${id}`, null)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onDeleteFile(id: number) {
    this.dataService
      .delete(`EntregaRecepcionCliente/DeleteFile/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
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
