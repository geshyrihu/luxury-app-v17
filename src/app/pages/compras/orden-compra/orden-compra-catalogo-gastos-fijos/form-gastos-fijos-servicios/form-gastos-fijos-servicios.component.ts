import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';

@Component({
  selector: 'app-form-gastos-fijos-servicios',
  templateUrl: './form-gastos-fijos-servicios.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormGastosFijosServiciosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  catalogoGastosFijosService = inject(CatalogoGastosFijosService);

  catalogoGastosFijosId: number = 0;
  productos: any[] = [];
  mensajeError = false;
  catalogoGastosFijosDetalles: any;
  id: any;
  cb_unidadMedida: any[] = [];
  productosAgregados: any[] = [];

  ngOnInit(): void {
    this.apiRequestS
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
    const urlApi = `CatalogoGastosFijosDetalles/DetallesOrdenCompraFijos/${this.catalogoGastosFijosId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.productosAgregados = responseData;
    });
  }

  deleteProductoAgregado(id: number) {
    this.apiRequestS
      .onDelete(`CatalogoGastosFijosDetalles/${id}`)
      .then((responseData: boolean) => {
        this.onLoadProductsAgregados();
      });
  }
  onLoadProducts() {
    const urlApi =
      'CatalogoGastosFijosDetalles/GetALLCatalogoGastosFijosProductoDto/' +
      this.catalogoGastosFijosId;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.productos = responseData;
    });
  }

  onSubmit(item: any) {
    if (item.unidadMedidaId === 0 || item.cantidad === 0) {
      this.mensajeError = true;
      return;
    }

    item.catalogoGastosFijosId = this.catalogoGastosFijosId;

    this.apiRequestS
      .onPost(`CatalogoGastosFijosDetalles/`, item)
      .then((responseData: boolean) => {
        this.mensajeError = false;
        this.onLoadProducts();
        this.onLoadProductsAgregados();
      });
  }

  onUpdateProductoAgregado(item: any) {
    this.apiRequestS
      .onPut(`CatalogoGastosFijosDetalles/${item.id}`, item)
      .then((responseData: boolean) => {
        this.mensajeError = false;
        this.onLoadProducts();
        this.onLoadProductsAgregados();
      });
  }
}
