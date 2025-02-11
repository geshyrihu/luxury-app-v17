import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CrudEntregaRecepcionClienteComponent from 'src/app/pages/settings/catalogos/entrega-recepcion/addoredit-entrega-recepcion-cliente/addoredit-entrega-recepcion-cliente.component';

@Component({
  selector: 'app-entrega-recepcion-cliente',
  templateUrl: './entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EntregaRecepcionClienteComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  public route = inject(Router);

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  data: any[] = [];
  cb_departamento = [
    { value: 'JURIDICO' },
    { value: 'ADMINISTRACIÓN Y FINANZAS' },
    { value: 'OPERACIONES Y MANTENIMIENTO' },
  ];
  ref: DynamicDialogRef;

  departamento = this.cb_departamento[0].value;

  onValidarCargo() {
    if (this.authS.onValidateRoles(['Contador']))
      this.departamento = this.cb_departamento[1].value;
    if (this.authS.onValidateRoles(['Legal']))
      this.departamento = this.cb_departamento[0].value;
    if (this.authS.onValidateRoles(['Operaciones']))
      this.departamento = this.cb_departamento[2].value;
  }

  ngOnInit(): void {
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
    // * Peticion para generar los items de entrega recepcion
    const urlApi1 = 'EntregaRecepcionCliente/GenerateData';
    this.apiRequestS.onGetItem(urlApi1).then((result: any) => {});

    // * Peticion para generar los items de entrega recepcion

    const urlApi =
      'EntregaRecepcionCliente/' +
      this.customerIdS.customerId +
      '/' +
      this.departamento;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        CrudEntregaRecepcionClienteComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onValidarDocument(id: number) {
    this.apiRequestS
      .onPut(
        `EntregaRecepcionCliente/ValidarArchivo/${this.authS.applicationUserId}/${id}`,
        null
      )
      .then((result: boolean) => {
        this.onLoadData();
      });
  }
  onInvalidarDocument(id: number) {
    this.apiRequestS
      .onPut(`EntregaRecepcionCliente/InvalidarArchivo/${id}`, null)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  onDeleteFile(id: number) {
    this.apiRequestS
      .onDelete(`EntregaRecepcionCliente/DeleteFile/${id}`)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }
}
