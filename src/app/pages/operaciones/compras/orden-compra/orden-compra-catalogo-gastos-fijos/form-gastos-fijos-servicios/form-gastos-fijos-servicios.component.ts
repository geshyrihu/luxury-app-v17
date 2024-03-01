import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CatalogoGastosFijosService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-gastos-fijos-servicios',
  templateUrl: './form-gastos-fijos-servicios.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormGastosFijosServiciosComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  catalogoGastosFijosId: number = 0;
  productos: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  mensajeError = false;
  catalogoGastosFijosDetalles: any;
  id: any;
  cb_unidadMedida: any[] = [];
  productosAgregados: any[] = [];

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });

    this.catalogoGastosFijosId =
      this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    this.onLoadProducts();
    this.onLoadProductsAgregados();
  }
  onLoadProductsAgregados() {
    this.dataService
      .get(
        `CatalogoGastosFijosDetalles/DetallesOrdenCompraFijos/${this.catalogoGastosFijosId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.productosAgregados = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  deleteProductoAgregado(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`CatalogoGastosFijosDetalles/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadProductsAgregados();
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadProducts() {
    this.dataService
      .get(
        'CatalogoGastosFijosDetalles/GetALLCatalogoGastosFijosProductoDto/' +
          this.catalogoGastosFijosId
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.productos = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit(item: any) {
    if (item.unidadMedidaId === 0 || item.cantidad === 0) {
      this.mensajeError = true;
      return;
    }

    item.catalogoGastosFijosId = this.catalogoGastosFijosId;
    this.dataService
      .post<any>(`CatalogoGastosFijosDetalles/`, item)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.mensajeError = false;
          this.onLoadProducts();
          this.onLoadProductsAgregados();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onUpdateProductoAgregado(item: any) {
    this.dataService
      .put(`CatalogoGastosFijosDetalles/${item.id}`, item)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.mensajeError = false;
          this.onLoadProducts();
          this.onLoadProductsAgregados();
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
