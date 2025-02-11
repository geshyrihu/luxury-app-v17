import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import BuscadorProvedorComponent from './buscador-proveedor.component';
import ListProviderComponent from './list-provider.component';

@Component({
    selector: 'app-dashboard-proveedor',
    templateUrl: './dashboard-proveedor.component.html',
    imports: [
        LuxuryAppComponentsModule,
        BuscadorProvedorComponent,
        ListProviderComponent,
    ]
})
export default class DashboardProveedorComponent {
  mostrarBuscador: boolean = true;
}
