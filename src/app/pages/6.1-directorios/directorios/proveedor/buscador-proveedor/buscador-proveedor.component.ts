import { Component, OnInit, inject } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddoreditProveedorComponent from '../addoredit-proveedor/addoredit-proveedor.component';
import CalificacionProveedorComponent from '../calificacion-proveedor/calificacion-proveedor.component';
import TarjetaProveedorComponent from '../tarjeta-proveedor/tarjeta-proveedor.component';

@Component({
  selector: 'app-buscador-proveedor',
  templateUrl: './buscador-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbRatingModule],
})
export default class BuscadorProvedorComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  incluirInactivos: boolean = false;
  url_img = `${environment.base_urlImg}providers/`;

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
    this.dialogHandlerService.openDialog(
      TarjetaProveedorComponent,
      data,
      data.title,
      this.dialogHandlerService.dialogSizeLg
    );
  }
  showModalCalificarProveedor(data: any) {
    this.dialogHandlerService
      .openDialog(
        CalificacionProveedorComponent,
        {
          providerId: data.providerId,
        },
        'Calificar a ' + data.nameProvider,
        this.dialogHandlerService.dialogSizeSm
      )
      .then((result: boolean) => {
        if (result) this.buscar();
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditProveedorComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.buscar();
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
    this.apiRequestService
      .onPut(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .then((result: boolean) => {
        this.buscar();
      });
  }

  buscar() {
    if (this.filtro === '') return;
    this.resultados = [];
    this.loading = true;

    const urlApi = `proveedor/buscarProveedor/${this.incluirInactivos}/${this.filtro}`;
    this.apiRequestService.onGetListNotLoading(urlApi).then((result: any) => {
      this.resultados = result;
      this.loading = false;
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`providers/${id}`)
      .then((result: boolean) => {
        if (result) this.buscar();
      });
  }
}
