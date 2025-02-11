import { Component, OnInit, inject } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditProveedorComponent from './addoredit-proveedor.component';
import CalificacionProveedorComponent from './calificacion-proveedor.component';
import TarjetaProveedorComponent from './tarjeta-proveedor.component';

@Component({
    selector: 'app-buscador-proveedor',
    templateUrl: './buscador-proveedor.component.html',
    imports: [LuxuryAppComponentsModule, NgbRatingModule]
})
export default class BuscadorProvedorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);

  incluirInactivos: boolean = false;

  ref: DynamicDialogRef;

  filtro: string = '';
  resultados: any[] = [];
  loading: boolean = false;
  validateRole(value: string[]): boolean {
    return this.authS.onValidateRoles(value);
  }
  ngOnInit(): void {}
  onSelectForState() {
    this.incluirInactivos = !this.incluirInactivos;
    this.buscar();
  }

  showModalCardProveedor(data: any) {
    this.dialogHandlerS.openDialog(
      TarjetaProveedorComponent,
      data,
      data.title,
      this.dialogHandlerS.dialogSizeLg
    );
  }
  showModalCalificarProveedor(data: any) {
    this.dialogHandlerS
      .openDialog(
        CalificacionProveedorComponent,
        {
          providerId: data.providerId,
        },
        'Calificar a ' + data.nameProvider,
        this.dialogHandlerS.dialogSizeSm
      )
      .then((responseData: boolean) => {
        if (responseData) this.buscar();
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditProveedorComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.buscar();
      });
  }

  calificacionPromedio(data: any, valor: string): number {
    let suma: number = 0;
    data.forEach((element) => {
      suma += element[valor];
    });
    const restult = suma / data.length;

    return restult;
  }
  onActivateProvider(data: any) {
    this.apiRequestS
      .onPut(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .then((responseData: boolean) => {
        this.buscar();
      });
  }

  buscar() {
    if (this.filtro === '') return;
    this.resultados = [];
    this.loading = true;

    const urlApi = `proveedor/buscarProveedor/${this.incluirInactivos}/${this.filtro}`;
    this.apiRequestS.onGetListNotLoading(urlApi).then((responseData: any) => {
      this.resultados = responseData;
      this.loading = false;
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`providers/${id}`)
      .then((responseData: boolean) => {
        if (responseData) this.buscar();
      });
  }
}
