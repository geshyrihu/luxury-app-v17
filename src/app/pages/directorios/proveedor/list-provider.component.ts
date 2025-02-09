import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IBusquedaProveedor } from 'src/app/core/interfaces/busqueda-proveedor.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditProveedorComponent from './addoredit-proveedor.component';
import ProviderUseComponent from './provider-use.component';
import TarjetaProveedorComponent from './tarjeta-proveedor.component';

@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListProviderComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);

  data: IBusquedaProveedor[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  validateRole(value: string[]): boolean {
    return this.authS.onValidateRoles(value);
  }
  onLoadData() {
    const urlApi = `proveedor/listadoproveedores`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`providers/${id}`)
      .then((result: boolean) => {
        if (result)
          this.data = this.data.filter((item) => item.providerId !== id);
      });
  }

  onAutorizarProvider(providerId: number) {
    const urlApi = `Proveedor/Autorizar/${providerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }

  showModalCardProveedor(data: any) {
    this.dialogHandlerService.openDialog(
      TarjetaProveedorComponent,
      data,
      data.title,
      this.dialogHandlerService.dialogSizeLg
    );
  }
  onConicidencias(data: any) {
    this.dialogHandlerService.openDialog(
      ProviderUseComponent,
      data,
      data.title,
      this.dialogHandlerService.dialogSizeLg
    );
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditProveedorComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onActivateProvider(data: any) {
    this.apiRequestService
      .onPut(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }
}
