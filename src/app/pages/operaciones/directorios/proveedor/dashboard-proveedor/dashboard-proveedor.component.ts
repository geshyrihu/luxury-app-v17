import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { environment } from 'src/environments/environment';
import BuscadorProvedorComponent from '../buscador-proveedor/buscador-proveedor.component';
import ListProviderComponent from '../buscador-proveedor/list-provider.component';

@Component({
  selector: 'app-dashboard-proveedor',
  templateUrl: './dashboard-proveedor.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    NgbAlert,
    BuscadorProvedorComponent,
    ListProviderComponent,
    CommonModule,
    LuxuryAppComponentsModule,
  ],
})
export default class DashboardProveedorComponent {
  filePath: string = environment.base_urlImg + 'Administration/formatos/';
  mostrarBuscador: boolean = true;
  url =
    environment.base_public + 'documentos/operaciones/glb-altaproveedor.docx';
}
