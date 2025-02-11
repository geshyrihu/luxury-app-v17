import { Component, inject } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import FormCatalogoGastosFijosComponent from '../form-catalogo-gastos-fijos/form-catalogo-gastos-fijos.component';
import FormGastosFijosPresupuestoComponent from '../form-gastos-fijos-presupuesto/form-gastos-fijos-presupuesto.component';
import FormGastosFijosServiciosComponent from '../form-gastos-fijos-servicios/form-gastos-fijos-servicios.component';

@Component({
    selector: 'app-modal-orden-compra-grastos-fijos',
    templateUrl: './modal-orden-compra-grastos-fijos.component.html',
    imports: [
        LuxuryAppComponentsModule,
        NgbNavModule,
        FormCatalogoGastosFijosComponent,
        FormGastosFijosServiciosComponent,
        FormGastosFijosPresupuestoComponent,
    ]
})
export default class ModalOrdenCompraGrastosFijosComponent {
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
}
