import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IBusquedaProveedor } from 'src/app/core/interfaces/busqueda-proveedor.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import AddoreditProveedorComponent from '../addoredit-proveedor/addoredit-proveedor.component';
import TarjetaProveedorComponent from '../tarjeta-proveedor/tarjeta-proveedor.component';
@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListProviderComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  authService = inject(AuthService);

  data: IBusquedaProveedor[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  url_img = `${environment.base_urlImg}providers/`;

  ngOnInit(): void {
    this.onLoadData();
  }
  validateRole(value: string[]): boolean {
    return this.authService.onValidateRoles(value);
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IBusquedaProveedor[]>(`Proveedor/ListadoProveedores`)
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`providers/${id}`)
      .then((result: boolean) => {
        if (result)
          this.data = this.data.filter((item) => item.providerId !== id);
      });
  }

  onAutorizarProvider(providerId: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IBusquedaProveedor[]>(`Proveedor/Autorizar/${providerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalCardProveedor(data: any) {
    this.ref = this.dialogService.open(TarjetaProveedorComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditProveedorComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
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

  onActivateProvider(data: any) {
    this.dataService
      .put(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
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
